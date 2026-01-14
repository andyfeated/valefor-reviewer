import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/base/prisma.service';
import { GitHostFactory } from 'src/git-host/factory/git-host.factory';
import { NormalizedPullRequest } from 'src/types/normalizedPullRequest.type';
import { UserService } from 'src/user/user.service';
import { extractProviderFromPrUrl } from 'src/utils/extractProviderFromPrUrl';
import { DiffValidator } from './diff/diff-validator';
import { MappedDiff } from 'src/git-host/strategy/git-host.strategy';
import { PrValidator } from './pr/pr-validator';
import { AIService } from 'src/ai/ai.service';
import {
  CriticalityLevel,
  ReviewStatus,
  Role,
} from 'src/generated/prisma/enums';
import { Review } from 'src/generated/prisma/client';
import { getDailyWindowUTC } from 'src/utils/getDailyWindowUtc';

@Injectable()
export class ReviewService {
  constructor(
    private userService: UserService,
    private githostFactory: GitHostFactory,
    private prismaService: PrismaService,
    private diffValidator: DiffValidator,
    private prValidator: PrValidator,
    private aiService: AIService,
  ) {}

  async getReviews(userId: string, page = 1, pageSize = 4) {
    try {
      const items = await this.prismaService.review.findMany({
        where: { userId },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: { diffs: { select: { isValid: true } } },
      });

      const totalCount = await this.prismaService.review.count({
        where: { userId },
      });

      return {
        totalCount,
        items,
      };
    } catch (err) {
      throw new BadRequestException(err?.message || 'Failed to fetch reviews');
    }
  }

  async reviewPullRequest(prUrl: string, userId: string, role: Role) {
    try {
      // User Validators
      await this.assertDailyReviewLimit(userId, role);

      // Githost Logic
      const provider = extractProviderFromPrUrl(prUrl);

      const oauthIdentity = await this.userService.getOAuthIdentity(
        userId,
        provider,
      );

      const accessToken = oauthIdentity.accessToken;
      const githost = this.githostFactory.create(provider);

      const { projectId, pullRequestIid } =
        githost.extractPullRequestDetailsFromUrl(prUrl);

      const existingReview = await this.getReviewByProjectIdAndAndPrId(
        userId,
        projectId,
        pullRequestIid,
      );

      if (existingReview) {
        return existingReview;
      }

      const diffs: any[] = await githost.getDiffs(
        projectId,
        pullRequestIid,
        accessToken,
      );

      // Diff Level Validators
      const mappedDiffs: MappedDiff[] = diffs.map((diff) =>
        githost.mapDiff(diff),
      );

      const diffsWithValidation = mappedDiffs.map((mappedDiff) => {
        const validationResult = this.diffValidator.validate(mappedDiff);

        return {
          mappedDiff,
          isValid: validationResult.passed,
          validationReason: validationResult.reason,
        };
      });

      const validDiffs = diffsWithValidation
        .filter((diff) => diff.isValid)
        .map((diff) => diff.mappedDiff);

      // PR Level Validators
      const prValidation = this.prValidator.validate(validDiffs);

      if (!prValidation.passed) {
        throw new Error(prValidation.reason);
      }

      const pullRequestMeta = await githost.getPullRequest(
        projectId,
        pullRequestIid,
        accessToken,
      );

      const normalizedPullRequest =
        githost.normalizePullRequest(pullRequestMeta);

      const review = await this.createReview(
        normalizedPullRequest,
        userId,
        prUrl,
        projectId,
      );

      await this.createDiffs(review.id, diffsWithValidation);

      // Send diffs to LLM asynchronously (no await)
      this.dispatchSendDiffsToLlm(review.id, validDiffs);

      return review;
    } catch (err) {
      throw new BadRequestException(err.message || 'Failed to create review');
    }
  }

  private async dispatchSendDiffsToLlm(
    reviewId: string,
    validDiffs: MappedDiff[],
  ) {
    try {
      const sanitizedDiffs = validDiffs.map((diff) => ({
        path: diff.path,
        diff: diff.diff,
      }));

      const aiOutput = await this.aiService.reviewDiffs(sanitizedDiffs);

      const match = aiOutput.match(/```json\s*([\s\S]*?)```/i);
      if (!match) throw new Error('Failed to extract JSON from AI output');

      const diffsWithConcerns: {
        path: string;
        concerns: string[];
        criticality: string;
      }[] = JSON.parse(match[1]);

      await Promise.all(
        diffsWithConcerns.map((diff) =>
          this.updateDiffConcerns(
            reviewId,
            diff.path,
            diff.concerns,
            diff.criticality as CriticalityLevel,
          ),
        ),
      );

      await this.updateReviewStatus(reviewId, ReviewStatus.done);
    } catch (error) {
      await this.updateReviewStatus(
        reviewId,
        ReviewStatus.failed,
        error?.message || 'Fail Reason cannot be found',
      );
    }
  }

  private async assertDailyReviewLimit(userId: string, role: Role) {
    const MAX_REVIEW_PER_DAY = 5;

    if (role !== Role.free_user) {
      return;
    }

    const { start, end } = getDailyWindowUTC();

    const reviews = await this.prismaService.review.findMany({
      where: { userId, createdAt: { gte: start, lt: end } },
      select: { id: true, createdAt: true },
    });

    if (reviews.length >= MAX_REVIEW_PER_DAY) {
      throw new BadRequestException(
        `Daily review limit reached (${MAX_REVIEW_PER_DAY} PRs per day, resets at 12:00 UTC)`,
      );
    }
  }
  private async createReview(
    pullRequestMeta: NormalizedPullRequest,
    userId: string,
    prUrl: string,
    projectId: string,
  ) {
    return this.prismaService.review.create({
      data: {
        ...pullRequestMeta,
        userId,
        pullRequestUrl: prUrl,
        providerProjectId: projectId,
        createdAt: new Date(),
      },
    });
  }

  private async createDiffs(
    reviewId: string,
    diffsWithValidation: Array<{
      mappedDiff: MappedDiff;
      isValid: boolean;
      validationReason?: string;
    }>,
  ) {
    return this.prismaService.$transaction(
      diffsWithValidation.map((diff) => {
        const data = {
          reviewId,
          path: diff.mappedDiff.path,
          oldPath: null,
          isValid: diff.isValid,
          validationReason: diff.validationReason ?? null,
          diff: diff.isValid ? diff.mappedDiff.diff : null,
          criticalityLevel: null,
          concerns: null,
        };

        return this.prismaService.diff.create({ data });
      }),
    );
  }

  async getReview(id: string, userId: string) {
    const review = this.prismaService.review.findFirst({
      where: { id, userId },
      include: { diffs: true },
    });

    return review;
  }

  private async updateDiffConcerns(
    reviewId: string,
    path: string,
    concerns: string[],
    criticalityLevel: CriticalityLevel,
  ) {
    return this.prismaService.diff.update({
      where: { reviewId_path: { reviewId, path } },
      data: {
        concerns,
        criticalityLevel,
      },
    });
  }

  private async updateReviewStatus(
    id: string,
    status: ReviewStatus,
    failReason?: string,
  ) {
    const data: Partial<Review> = {
      status,
    };

    if (failReason) {
      data.failReason = failReason;
    }

    const review = this.prismaService.review.update({
      where: { id },
      data,
    });

    return review;
  }

  async getReviewByProjectIdAndAndPrId(
    userId: string,
    projectId: string,
    pullRequestIid: string,
  ) {
    return this.prismaService.review.findFirst({
      where: {
        userId,
        pullRequestIid,
        providerProjectId: projectId,
      },
    });
  }
}

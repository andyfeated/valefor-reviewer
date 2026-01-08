import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/base/prisma.service';
import { GitHostFactory } from 'src/git-host/factory/git-host.factory';
import { NormalizedPullRequest } from 'src/types/normalizedPullRequest.type';
import { UserService } from 'src/user/user.service';
import { extractProviderFromPrUrl } from 'src/utils/extractProviderFromPrUrl';
import { DiffValidator } from './diff/diff-validator';
import { MappedDiff } from 'src/git-host/strategy/git-host.strategy';

@Injectable()
export class ReviewService {
  constructor(
    private userService: UserService,
    private githostFactory: GitHostFactory,
    private prismaService: PrismaService,
    private diffValidator: DiffValidator,
  ) {}

  async reviewPullRequest(prUrl: string, userId: string) {
    const provider = extractProviderFromPrUrl(prUrl);

    const oauthIdentity = await this.userService.getOAuthIdentity(
      userId,
      provider,
    );
    const accessToken = oauthIdentity.accessToken;

    const githost = this.githostFactory.create(provider);

    const { projectId, pullRequestIid } =
      githost.extractPullRequestDetailsFromUrl(prUrl);

    try {
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

      // Validators
      const mappedDiffs = diffs.map((diff) => githost.mapDiff(diff));

      const validDiffs = mappedDiffs.filter((mappedDiff) => {
        const validationResult = this.diffValidator.validate(mappedDiff);

        return validationResult.passed;
      });

      if (!validDiffs.length) {
        throw new Error('No valid diffs found');
      }

      if (diffs.length > 10) {
        throw new Error('Can only review 10 files per PR');
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

      await this.createDiffs(review.id, validDiffs);

      return review;
    } catch (err) {
      throw new BadRequestException(err.message || 'Failed to create review');
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
      },
    });
  }

  private async createDiffs(reviewId: string, mappedDiffs: MappedDiff[]) {
    return this.prismaService.$transaction(
      mappedDiffs.map((diff) => {
        const data = {
          reviewId,
          path: diff.path,
          oldPath: null,
          diff: diff.diff,
          criticalityLevel: null,
          concerns: null,
        };

        return this.prismaService.diff.create({ data });
      }),
    );
  }

  async getReview(id: string, userId: string) {
    return this.prismaService.review.findFirst({
      where: { id, userId },
    });
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

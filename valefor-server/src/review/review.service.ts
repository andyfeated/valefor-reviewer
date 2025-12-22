import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/base/prisma.service';
import { GitHostFactory } from 'src/git-host/factory/git-host.factory';
import { NormalizedPullRequest } from 'src/types/normalizedPullRequest.type';
import { UserService } from 'src/user/user.service';
import { extractProviderFromPrUrl } from 'src/utils/extractProviderFromPrUrl';

@Injectable()
export class ReviewService {
  constructor(
    private userService: UserService,
    private githostFactory: GitHostFactory,
    private prismaService: PrismaService,
  ) {}

  async reviewPullRequest(prUrl: string, userId: string) {
    const provider = extractProviderFromPrUrl(prUrl);

    const oauthIdentity = await this.userService.getOAuthIdentity(
      userId,
      provider,
    );
    const accessToken = oauthIdentity.accessToken;

    const githost = this.githostFactory.create(provider);

    const { projectId: projectIid, pullRequestId } =
      githost.extractPullRequestDetailsFromUrl(prUrl);

    try {
      const existingReview = await this.getReviewByProjectIdAndAndPrId(
        userId,
        projectIid,
        pullRequestId,
      );

      if (existingReview) {
        return existingReview;
      }

      const pullRequest = await githost.getPullRequest(
        projectIid,
        pullRequestId,
        accessToken,
      );

      const normalizedPullRequest = githost.normalizePullRequest(pullRequest);

      const review = await this.createReview(
        normalizedPullRequest,
        userId,
        prUrl,
        projectIid,
      );

      return review;
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }

  async createReview(
    pullRequestMeta: NormalizedPullRequest,
    userId: string,
    prUrl: string,
    projectIid: string,
  ) {
    // NOTE: pullRequest !== review
    return this.prismaService.review.create({
      data: {
        ...pullRequestMeta,
        userId,
        pullRequestUrl: prUrl,
        providerProjectIid: projectIid,
      },
    });
  }

  async getReview(id: string, userId: string) {
    return this.prismaService.review.findFirst({
      where: { id, userId },
    });
  }

  async getReviewByProjectIdAndAndPrId(
    userId: string,
    projectId: string,
    pullRequestId: string,
  ) {
    return this.prismaService.review.findFirst({
      where: {
        userId,
        providerPrIid: pullRequestId,
        providerProjectIid: projectId,
      },
    });
  }
}

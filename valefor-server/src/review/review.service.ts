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

    const { projectId, pullRequestId } =
      githost.extractPullRequestDetailsFromUrl(prUrl);

    try {
      const pullRequest = await githost.getPullRequest(
        projectId,
        pullRequestId,
        accessToken,
      );

      const normalizedPullRequest = githost.normalizePullRequest(
        pullRequest,
        prUrl,
        projectId,
      );

      const review = await this.createReview(normalizedPullRequest);

      return review;
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }

  async createReview(pullRequest: NormalizedPullRequest) {
    return this.prismaService.review.create({
      data: pullRequest,
    });
  }
}

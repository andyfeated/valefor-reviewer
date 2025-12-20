import { Injectable, UnauthorizedException } from '@nestjs/common';
import { GitHostFactory } from 'src/git-host/factory/git-host.factory';
import { UserService } from 'src/user/user.service';
import { extractProviderFromPrUrl } from 'src/utils/extractProviderFromPrUrl';

@Injectable()
export class ReviewService {
  constructor(
    private userService: UserService,
    private githostFactory: GitHostFactory,
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
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }
}

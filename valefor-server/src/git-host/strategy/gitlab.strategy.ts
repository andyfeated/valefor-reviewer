import { HttpException } from '@nestjs/common';
import {
  GitHostStrategy,
  PullRequestDetailsFromUrl,
} from './git-host.strategy';

export class GitlabStrategy implements GitHostStrategy {
  private readonly baseUrl = 'https://gitlab.com/api/v4';

  isPublicRepo(prUrl: string): boolean {
    return true;
  }

  exhangeCodeForToken(): void {}

  extractPullRequestDetailsFromUrl(prUrl: string): PullRequestDetailsFromUrl {
    const prUrlObj = new URL(prUrl);

    const host = prUrlObj.host;
    const path = prUrlObj.pathname;

    const splittedPath = path.split('/');

    const projectId = splittedPath[splittedPath.length - 4];
    const pullRequestId = splittedPath[splittedPath.length - 1];

    return { host, projectId, pullRequestId };
  }

  async getPullRequest(
    projectId: string,
    pullRequestId: string,
    accessToken: string,
  ) {
    const res = await fetch(
      `${this.baseUrl}/projects/${projectId}/merge_requests/${pullRequestId}`,
      { headers: { 'PRIVATE-TOKEN': accessToken } },
    );

    if (!res.ok) {
      throw new HttpException(await res.text(), res.status);
    }
  }
}

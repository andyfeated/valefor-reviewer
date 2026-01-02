import { NormalizedPullRequest } from 'src/types/normalizedPullRequest.type';
import {
  GitHostStrategy,
  PullRequestDetailsFromUrl,
} from './git-host.strategy';

export class GithubStrategy implements GitHostStrategy {
  extractPullRequestDetailsFromUrl(prUrl: string): PullRequestDetailsFromUrl {
    return { projectId: '', host: '', pullRequestIid: '' };
  }

  async getPullRequest(prUrl: string): Promise<any> {
    await Promise.resolve();
  }

  normalizePullRequest(pulLRequest: any): NormalizedPullRequest {
    return {} as NormalizedPullRequest;
  }
}

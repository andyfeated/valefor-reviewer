import { NormalizedPullRequest } from 'src/types/normalizedPullRequest.type';
import {
  GitHostStrategy,
  MappedDiff,
  PullRequestDetailsFromUrl,
} from './git-host.strategy';

export class GithubStrategy implements GitHostStrategy {
  extractPullRequestDetailsFromUrl(prUrl: string): PullRequestDetailsFromUrl {
    return { projectId: '', host: '', pullRequestIid: '' };
  }

  async getPullRequest(): Promise<any> {
    await Promise.resolve();
  }

  async getDiffs(): Promise<any> {
    await Promise.resolve();
  }

  mapDiff(diff: any): MappedDiff {
    throw new Error('Method not implemented.');
  }

  normalizePullRequest(pulLRequest: any): NormalizedPullRequest {
    return {} as NormalizedPullRequest;
  }
}

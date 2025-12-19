import {
  GitHostStrategy,
  PullRequestDetailsFromUrl,
} from './git-host.strategy';

export class GithubStrategy implements GitHostStrategy {
  isPublicRepo(prUrl: string): boolean {
    return true;
  }

  extractPullRequestDetailsFromUrl(prUrl: string): PullRequestDetailsFromUrl {
    return { projectId: '', host: '', pullRequestId: '' };
  }

  getPullRequest(prUrl: string) {}
}

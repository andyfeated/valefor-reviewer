import { NormalizedPullRequest } from 'src/types/normalizedPullRequest.type';

export type PullRequestDetailsFromUrl = {
  host: string;
  projectId: string;
  pullRequestIid: string;
};

export interface GitHostStrategy {
  extractPullRequestDetailsFromUrl(prUrl: string): PullRequestDetailsFromUrl;
  getPullRequest(
    projectId: string,
    pullRequestIid: string,
    accessToken: string,
  ): Promise<any>;
  normalizePullRequest(pulLRequest: any): NormalizedPullRequest;
}

import { NormalizedPullRequest } from 'src/types/normalizedPullRequest.type';

export type PullRequestDetailsFromUrl = {
  host: string;
  projectId: string;
  pullRequestId: string;
};

export interface GitHostStrategy {
  extractPullRequestDetailsFromUrl(prUrl: string): PullRequestDetailsFromUrl;
  getPullRequest(
    projectId: string,
    pullRequestId: string,
    accessToken: string,
  ): Promise<any>;
  normalizePullRequest(
    pulLRequest: any,
    prUrl: string,
    projectId: string,
    userId: string,
  ): NormalizedPullRequest;
}

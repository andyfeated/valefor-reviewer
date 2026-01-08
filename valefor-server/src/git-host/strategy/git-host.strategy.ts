import { NormalizedPullRequest } from 'src/types/normalizedPullRequest.type';

export type PullRequestDetailsFromUrl = {
  host: string;
  projectId: string;
  pullRequestIid: string;
};

export type MappedDiff = {
  diff: string;
  path: string;
  addedLines: number;
  removedLines: number;
  totalLines: number;
  isTooLarge: boolean;
};

export interface GitHostStrategy {
  extractPullRequestDetailsFromUrl(prUrl: string): PullRequestDetailsFromUrl;
  getPullRequest(
    projectId: string,
    pullRequestIid: string,
    accessToken: string,
  ): Promise<any>;
  getDiffs(
    projectId: string,
    pullRequestIid: string,
    accessToken: string,
  ): Promise<any>;
  mapDiff(diff: any): MappedDiff;
  normalizePullRequest(pulLRequest: any): NormalizedPullRequest;
}

export type PullRequestDetailsFromUrl = {
  host: string;
  projectId: string;
  pullRequestId: string;
};

export interface GitHostStrategy {
  isPublicRepo(prUrl: string): boolean;
  extractPullRequestDetailsFromUrl(prUrl: string): PullRequestDetailsFromUrl;
  getPullRequest(
    projectId: string,
    pullRequestId: string,
    accessToken: string,
  ): Promise<any>;
}

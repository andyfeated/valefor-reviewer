export type NormalizedPullRequest = {
  provider: 'gitlab' | 'github';
  providerPrId: string;
  providerPrIid: string;
  providerProjectId: string;
  providerProjectIid: string;

  title: string;
  description: string;
  state: 'open' | 'closed' | 'merged';
  pullRequestUrl: string;
  sourceBranch: string;
  targetBranch: string;

  author: { id: number; username: string; name: string };

  headSha: string;
  createdAt: string;
  updatedAt: string;
};

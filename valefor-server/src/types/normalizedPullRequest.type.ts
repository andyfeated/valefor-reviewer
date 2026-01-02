export type NormalizedPullRequest = {
  provider: 'gitlab' | 'github';
  pullRequestId: string;
  pullRequestIid: string;
  providerProjectIid: string;

  title: string;
  description: string;
  state: 'open' | 'closed' | 'merged';
  sourceBranch: string;
  targetBranch: string;

  author: { id: number; username: string; name: string };

  headSha: string;
  createdAt: string;
  updatedAt: string;
};

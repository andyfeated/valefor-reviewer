import { HttpException } from '@nestjs/common';
import {
  GitHostStrategy,
  PullRequestDetailsFromUrl,
} from './git-host.strategy';
import { NormalizedPullRequest } from 'src/types/normalizedPullRequest.type';

export class GitlabStrategy implements GitHostStrategy {
  private readonly baseUrl = 'https://gitlab.com/api/v4';

  extractPullRequestDetailsFromUrl(prUrl: string): PullRequestDetailsFromUrl {
    const prUrlObj = new URL(prUrl);

    const host = prUrlObj.host;
    const path = prUrlObj.pathname;

    const splittedPath = path.split('/-/');

    const projectId = splittedPath[0].slice(1);
    const pullRequestId = splittedPath[1].replace('merge_requests/', '');

    return { host, projectId, pullRequestId };
  }

  async getPullRequest(
    projectId: string,
    pullRequestId: string,
    accessToken: string,
  ) {
    const res = await fetch(
      `${this.baseUrl}/projects/${encodeURIComponent(projectId)}/merge_requests/${pullRequestId}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    if (!res.ok) {
      throw new HttpException(await res.text(), res.status);
    }

    return res.json();
  }

  normalizePullRequest(pr: any): NormalizedPullRequest {
    let normalizedState: 'open' | 'closed' | 'merged';
    switch (pr.state) {
      case 'opened':
        normalizedState = 'open';
        break;
      case 'merged':
        normalizedState = 'merged';
        break;
      case 'closed':
        normalizedState = 'closed';
        break;
      default:
        normalizedState = 'open';
    }

    return {
      provider: 'gitlab',
      providerPrId: String(pr.id),
      providerPrIid: String(pr.iid),
      providerProjectId: String(pr.project_id),

      title: pr.title,
      description: pr.description ?? '',
      state: normalizedState,
      sourceBranch: pr.source_branch,
      targetBranch: pr.target_branch,

      author: {
        id: pr.author.id,
        username: pr.author.username,
        name: pr.author.name,
      },

      headSha: pr.diff_refs?.head_sha ?? '',
      createdAt: pr.created_at,
      updatedAt: pr.updated_at,
    };
  }
}

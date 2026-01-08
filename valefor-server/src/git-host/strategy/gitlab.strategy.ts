import { HttpException } from '@nestjs/common';
import {
  GitHostStrategy,
  MappedDiff,
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
    const pullRequestIid = splittedPath[1].replace('merge_requests/', '');

    return { host, projectId, pullRequestIid };
  }

  async getPullRequest(
    projectId: string,
    pullRequestIid: string,
    accessToken: string,
  ) {
    const res = await fetch(
      `${this.baseUrl}/projects/${encodeURIComponent(projectId)}/merge_requests/${pullRequestIid}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    if (!res.ok) {
      throw new HttpException(await res.text(), res.status);
    }

    return res.json();
  }

  async getDiffs(
    projectId: string,
    pullRequestIid: string,
    accessToken: string,
  ) {
    const res = await fetch(
      `${this.baseUrl}/projects/${encodeURIComponent(projectId)}/merge_requests/${pullRequestIid}/diffs?unidiff=true`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    if (!res.ok) {
      throw new HttpException(await res.text(), res.status);
    }

    return res.json();
  }

  public mapDiff(raw: any): MappedDiff {
    const diff: string = raw.diff || '';
    const path: string = raw.new_path || raw.old_path;

    const lines = diff.split('\n');

    let added = 0;
    let removed = 0;
    let neutral = 0;

    for (const line of lines) {
      if (line.startsWith('+') && !line.startsWith('+++')) {
        added++;
      } else if (line.startsWith('-') && !line.startsWith('---')) {
        removed++;
      } else {
        neutral++;
      }
    }

    return {
      diff,
      path,
      addedLines: added,
      removedLines: removed,
      totalLines: added + removed + neutral - 3,
      isTooLarge: !!raw.too_large || !!raw.collapsed,
    };
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
      pullRequestId: String(pr.id),
      pullRequestIid: String(pr.iid),
      providerProjectIid: String(pr.project_id),

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

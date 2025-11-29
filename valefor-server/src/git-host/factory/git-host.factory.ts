import { BadRequestException, Injectable } from "@nestjs/common";
import { GitHostStrategy } from "../strategy/git-host.strategy";
import { GitlabStrategy } from "../strategy/gitlab.strategy";
import { GithubStrategy } from "../strategy/github.strategy";

@Injectable()
export class GitHostFactory {
  create(repoUrl: string): GitHostStrategy {
    if (repoUrl.includes('gitlab.com')) {
      return new GitlabStrategy
    }

    if (repoUrl.includes('github.com')) {
      return new GithubStrategy
    }

    throw new BadRequestException('This project only supports PRs from Gitlab or Github at the moment')
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { GitHostStrategy } from '../strategy/git-host.strategy';
import { GitlabStrategy } from '../strategy/gitlab.strategy';
import { GithubStrategy } from '../strategy/github.strategy';

@Injectable()
export class GitHostFactory {
  constructor(
    private githubProvider: GithubStrategy,
    private gitlabProvider: GitlabStrategy,
  ) {}

  create(provider: string): GitHostStrategy {
    switch (provider) {
      case 'github':
        return this.githubProvider;
      case 'gitlab':
        return this.gitlabProvider;
      default:
        throw new BadRequestException(`Unsupported provider: ${provider}`);
    }
  }
}

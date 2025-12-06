import { BadRequestException, Injectable } from '@nestjs/common';
import { GithubOAuthStrategy } from './strategy/github-oauth.strategy';
import { GitlabOAuthStrategy } from './strategy/gitlab-oauth.strategy';
import { OAuthStrategy } from './strategy/oauth.interface';

@Injectable()
export class OAuthFactory {
  constructor(
    private githubProvider: GithubOAuthStrategy,
    private gitlabProvider: GitlabOAuthStrategy,
  ) {}

  get(provider: string): OAuthStrategy {
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

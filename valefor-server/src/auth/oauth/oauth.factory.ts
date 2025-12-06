import { BadRequestException, Injectable } from '@nestjs/common';
import { GithubOAuthStrategy } from './providers/github-oauth.strategy';
import { GitlabOAuthStrategy } from './providers/gitlab-oauth.strategy';
import { OAuthStrategy } from './providers/oauth.interface';

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

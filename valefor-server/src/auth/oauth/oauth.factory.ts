import { BadRequestException, Injectable } from '@nestjs/common';
import { GithubOAuthProvider } from './providers/github-oauth.provider';
import { GitlabOAuthProvider } from './providers/gitlab-oauth.provider';
import { OAuthProvider } from './providers/oauth.interface';

@Injectable()
export class OAuthFactory {
  constructor(
    private githubProvider: GithubOAuthProvider,
    private gitlabProvider: GitlabOAuthProvider,
  ) {}

  get(provider: string): OAuthProvider {
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

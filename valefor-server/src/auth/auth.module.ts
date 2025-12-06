import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { OAuthService } from './oauth/oauth.service';
import { OAuthFactory } from './oauth/oauth.factory';
import { GithubOAuthStrategy } from './oauth/providers/github-oauth.strategy';
import { GitlabOAuthStrategy } from './oauth/providers/gitlab-oauth.strategy';

@Module({
  providers: [
    OAuthService,
    OAuthFactory,
    GithubOAuthStrategy,
    GitlabOAuthStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}

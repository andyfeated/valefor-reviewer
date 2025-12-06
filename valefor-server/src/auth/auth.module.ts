import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { OAuthService } from './oauth/oauth.service';
import { OAuthFactory } from './oauth/oauth.factory';
import { GithubOAuthProvider } from './oauth/providers/github-oauth.provider';
import { GitlabOAuthProvider } from './oauth/providers/gitlab-oauth.provider';

@Module({
  providers: [
    OAuthService,
    OAuthFactory,
    GithubOAuthProvider,
    GitlabOAuthProvider,
  ],
  controllers: [AuthController],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { OAuthService } from './oauth/oauth.service';
import { OAuthFactory } from './oauth/oauth.factory';
import { GithubOAuthStrategy } from './oauth/strategy/github-oauth.strategy';
import { GitlabOAuthStrategy } from './oauth/strategy/gitlab-oauth.strategy';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';

@Module({
  providers: [
    AuthService,
    OAuthService,
    OAuthFactory,
    GithubOAuthStrategy,
    GitlabOAuthStrategy,
  ],
  controllers: [AuthController],
  imports: [UserModule],
  exports: [OAuthService],
})
export class AuthModule {}

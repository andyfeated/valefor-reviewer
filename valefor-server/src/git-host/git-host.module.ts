import { Module } from '@nestjs/common';
import { GitHostFactory } from './factory/git-host.factory';
import { GithubStrategy } from './strategy/github.strategy';
import { GitlabStrategy } from './strategy/gitlab.strategy';

@Module({
  providers: [GitHostFactory, GithubStrategy, GitlabStrategy],
  exports: [GitHostFactory],
})
export class GitHostModule {}

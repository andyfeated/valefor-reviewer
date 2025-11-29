import { Module } from '@nestjs/common'
import { GitHostFactory } from './factory/git-host.factory';

@Module({
  providers: [GitHostFactory],
  exports: [GitHostFactory]
})

export class GitHostModule { }

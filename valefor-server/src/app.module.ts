import { Module } from '@nestjs/common';
import { PullRequestModule } from './pull-request/pull-request.module';

@Module({
  imports: [PullRequestModule],
  controllers: [],
  providers: [],
})
export class AppModule { }

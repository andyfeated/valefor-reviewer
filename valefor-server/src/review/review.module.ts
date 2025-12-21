import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { GitHostModule } from 'src/git-host/git-host.module';
import { ReviewService } from './review.service';
import { BaseModule } from 'src/base/base.module';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [],
  imports: [UserModule, AuthModule, GitHostModule, BaseModule],
})
export class ReviewModule {}

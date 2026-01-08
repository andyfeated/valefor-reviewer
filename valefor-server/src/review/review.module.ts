import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { GitHostModule } from 'src/git-host/git-host.module';
import { ReviewService } from './review.service';
import { BaseModule } from 'src/base/base.module';
import { DiffValidator } from './diff/diff-validator';
import {
  hasAdditionRule,
  isLogicFileRule,
  isNotNoisePathRule,
  isNotTooLargeRule,
  isNotTooLongRule,
} from './diff/diff-rules';

@Module({
  controllers: [ReviewController],
  providers: [
    {
      provide: 'DIFF_RULES',
      useValue: [
        isNotTooLargeRule,
        hasAdditionRule,
        isLogicFileRule,
        isNotNoisePathRule,
        isNotTooLongRule(1000),
      ],
    },
    ReviewService,
    DiffValidator,
  ],
  exports: [],
  imports: [UserModule, AuthModule, GitHostModule, BaseModule],
})
export class ReviewModule {}

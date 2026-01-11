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
  isNotTestFileRule,
  isNotTooLargeRule,
} from './diff/diff-rules';
import {
  hasValidDiffsRule,
  isWithinMaxFileRule,
  isWithinTokenLimitRule,
} from './pr/pr-rules';
import { PrValidator } from './pr/pr-validator';

export const MAX_FILES = 10;
export const MAX_PR_TOKENS = 7000;

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
        isNotTestFileRule,
        // isNotTooLongRule(500),
      ],
    },
    {
      provide: 'PR_RULES',
      useValue: [
        hasValidDiffsRule,
        isWithinMaxFileRule(MAX_FILES),
        isWithinTokenLimitRule(MAX_PR_TOKENS),
      ],
    },
    ReviewService,
    DiffValidator,
    PrValidator,
  ],
  exports: [],
  imports: [UserModule, AuthModule, GitHostModule, BaseModule],
})
export class ReviewModule {}

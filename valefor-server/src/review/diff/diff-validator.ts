import { MappedDiff } from 'src/git-host/strategy/git-host.strategy';
import { DiffRule, RuleResult } from './diff-rules';
import { Inject } from '@nestjs/common';

export class DiffValidator {
  constructor(@Inject('DIFF_RULES') private rules: DiffRule[]) {}

  validate(mappedDiff: MappedDiff): RuleResult {
    for (const rule of this.rules) {
      const result = rule(mappedDiff);

      if (!result.passed) {
        return result;
      }
    }

    return { passed: true };
  }
}

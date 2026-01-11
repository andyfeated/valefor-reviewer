import { Inject } from '@nestjs/common';
import { PrRule, RuleResult } from './pr-rules';
import { MappedDiff } from 'src/git-host/strategy/git-host.strategy';

export class PrValidator {
  constructor(@Inject('PR_RULES') private readonly rules: PrRule[]) {}

  validate(validDiffs: MappedDiff[]): RuleResult {
    for (const rule of this.rules) {
      const result = rule(validDiffs);

      if (!result.passed) return result;
    }

    return { passed: true };
  }
}

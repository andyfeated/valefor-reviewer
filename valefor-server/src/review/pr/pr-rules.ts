import { MappedDiff } from 'src/git-host/strategy/git-host.strategy';

export type RuleResult = {
  passed: boolean;
  reason?: string;
};

export type PrRule = (validDIffs: MappedDiff[]) => RuleResult;

export function estimateTokens(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

export function estimatePrTokens(diffs: MappedDiff[]): number {
  return diffs.reduce((sum, d) => sum + estimateTokens(d.diff), 0);
}

export const hasValidDiffsRule: PrRule = (diffs) => ({
  passed: diffs.length > 0,
  reason: diffs.length > 0 ? undefined : 'No valid diffs found',
});

export const isWithinMaxFileRule =
  (maxFile: number): PrRule =>
  (diffs) => ({
    passed: diffs.length <= maxFile,
    reason:
      diffs.length <= maxFile
        ? undefined
        : `PR contains more than ${maxFile} reviewable files`,
  });

export const isWithinTokenLimitRule =
  (maxToken: number): PrRule =>
  (diffs) => {
    const totalTokens = estimatePrTokens(diffs);
    const passed = totalTokens <= maxToken;
    console.log(`Tokens: ${totalTokens}/${maxToken}`);

    return {
      passed,
      reason: passed
        ? undefined
        : `PR exceeded AI token limit (${totalTokens}/${maxToken})`,
    };
  };

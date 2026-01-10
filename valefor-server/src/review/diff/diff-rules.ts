import { MappedDiff } from 'src/git-host/strategy/git-host.strategy';

export type RuleResult = { passed: boolean; reason?: string };
export type DiffRule = (mappedDiff: MappedDiff) => RuleResult;

export const isNotTooLargeRule: DiffRule = (mappedDiff) => {
  const passed = !mappedDiff.isTooLarge;

  return { passed, reason: passed ? undefined : 'File is too large' };
};

export const hasAdditionRule: DiffRule = (mappedDiff) => {
  const passed = mappedDiff.addedLines > 0;

  return { passed, reason: passed ? undefined : 'Only contained removal' };
};

export const isLogicFileRule: DiffRule = (mappedDiff) => {
  const validExtensions = [
    '.ts',
    '.js',
    '.tsx',
    '.jsx',
    '.py',
    '.go',
    '.java',
    '.cpp',
    '.c',
    '.rb',
    '.php',
    '.cs',
    '.rs',
  ];

  const passed = validExtensions.some((ext) => mappedDiff.path.endsWith(ext));
  return { passed, reason: passed ? undefined : 'Unsupported File extension' };
};

export const isNotTestFileRule: DiffRule = (mappedDiff) => {
  const testPatterns = [
    '/test/',
    '/tests/',
    '/__tests__/',
    '/spec/',
    '/__mocks__/',
    '.test.',
    '.spec.',
    '.test.ts',
    '.test.js',
    '.test.tsx',
    '.test.jsx',
    '.spec.ts',
    '.spec.js',
    '.spec.tsx',
    '.spec.jsx',
  ];

  const passed = !testPatterns.some((pattern) =>
    mappedDiff.path.toLowerCase().includes(pattern.toLowerCase()),
  );

  return {
    passed,
    reason: passed ? undefined : 'File is a test file',
  };
};
export const isNotNoisePathRule: DiffRule = (mappedDiff) => {
  const noiseDirs = ['node_modules/', 'dist/', 'build/', 'vendor/', 'public/'];
  const passed = !noiseDirs.some((dir) => mappedDiff.path.includes(dir));

  return { passed, reason: passed ? undefined : 'Path is from a noise path' };
};

export const isNotTooLongRule =
  (max: number): DiffRule =>
  (mappedDiff) => {
    const passed = mappedDiff.totalLines <= max;

    return { passed, reason: passed ? undefined : 'File is too long' };
  };

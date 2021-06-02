import { ESLint } from 'eslint';
import { getPackageLocation } from '../../utils/getPackageLocation';
import path from 'path';
import { error, Result, value } from 'defekt';
import * as errors from '../../errors';

const lintCode = async function ({ applicationRoot }: {
  applicationRoot: string;
}): Promise<Result<undefined, errors.CodeMalformed>> {
  const patterns = [
    '**/*.js',
    '**/*.jsx',
    '**/*.ts',
    '**/*.tsx'
  ];

  const eslintConfigEsVersion = (await import(path.join(applicationRoot, 'package.json'))).default.dependencies['eslint-config-es'];
  const absoluteEslintPackageDirectory = (await getPackageLocation({
    applicationRoot,
    packageName: 'eslint-config-es',
    version: eslintConfigEsVersion
  })).unwrapOrThrow();
  const absoluteEslintConfigFile = path.join(absoluteEslintPackageDirectory, 'node.js');
  const baseEslintConfig = (await import(absoluteEslintConfigFile)).default;

  baseEslintConfig.ignorePatterns = [
    ...baseEslintConfig.ignorePatterns ?? [],
    'node_modules/**/*',
    'build/**/*',
    'coverage/**/*',
    'dist/**/*'
  ];

  const eslint = new ESLint({
    cwd: applicationRoot,
    baseConfig: baseEslintConfig,
    errorOnUnmatchedPattern: false
  });
  const formatter = await eslint.loadFormatter('stylish');
  const results = await eslint.lintFiles(patterns);

  if (results.some((eslintResult): boolean => eslintResult.errorCount > 0)) {
    return error(new errors.CodeMalformed(formatter.format(results)));
  }

  return value();
};

export {
  lintCode
};


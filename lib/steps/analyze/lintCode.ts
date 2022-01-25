import { ESLint } from 'eslint';
import { fileExists } from '../../utils/fileExists';
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

  let baseEslintConfig: any = {};

  if (!await fileExists({ absoluteFile: path.join(applicationRoot, '.eslintrc.json') })) {
    const eslintConfigEsVersion = (await import(`file://${path.join(applicationRoot, 'package.json')}`)).
      default.
      dependencies['eslint-config-es'];
    const absoluteEslintPackageDirectory = (await getPackageLocation({
      applicationRoot,
      packageName: 'eslint-config-es',
      version: eslintConfigEsVersion
    })).unwrapOrThrow();
    const absoluteEslintConfigFile = path.join(absoluteEslintPackageDirectory, 'node.js');

    baseEslintConfig = (await import(`file://${absoluteEslintConfigFile}`)).default;
  }

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
    return error(new errors.CodeMalformed(await formatter.format(results)));
  }

  return value();
};

export {
  lintCode
};


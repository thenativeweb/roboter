import { fileExists } from '../../utils/fileExists';
import { formatPackageJsonLintResults } from './formatPackageJsonLintResults';
import { getPackageJson } from '../../utils/getPackageJson';
import { getPackageLocation } from '../../utils/getPackageLocation';
import { NpmPackageJsonLint } from 'npm-package-json-lint';
import path from 'path';
import { error, Result, value } from 'defekt';
import * as errors from '../../errors';

const lintPackageJson = async function ({ applicationRoot }: {
  applicationRoot: string;
}): Promise<Result<undefined, errors.PackageJsonMalformed>> {
  const absolutePackageJsonFile = path.join(applicationRoot, 'package.json');
  const packageJson = (await getPackageJson({ absoluteDirectory: applicationRoot })).unwrapOrThrow();

  let absolutePackageJsonLintConfigFile;

  const absoluteCustomPackageJsonLintConfigFile = path.join(applicationRoot, '.npmpackagejsonlintrc.json');

  if (await fileExists({ absoluteFile: absoluteCustomPackageJsonLintConfigFile })) {
    absolutePackageJsonLintConfigFile = absoluteCustomPackageJsonLintConfigFile;
  } else {
    const packageJsonLintConfigVersion = (await import(`file://${path.join(applicationRoot, 'package.json')}`)).
      default.
      devDependencies['npm-package-json-lint-config-tnw'];
    const absolutePackageJsonLintPackageDirectory = (await getPackageLocation({
      applicationRoot,
      packageName: 'npm-package-json-lint-config-tnw',
      version: packageJsonLintConfigVersion
    })).unwrapOrThrow();

    absolutePackageJsonLintConfigFile = path.join(absolutePackageJsonLintPackageDirectory, 'lib.json');
  }

  const npmPackageJsonLint = new NpmPackageJsonLint({
    cwd: applicationRoot,
    packageJsonObject: packageJson,
    packageJsonFilePath: absolutePackageJsonFile,
    configFile: absolutePackageJsonLintConfigFile
  });

  const linterResult = npmPackageJsonLint.lint();

  if (linterResult.errorCount > 0) {
    return error(new errors.PackageJsonMalformed(formatPackageJsonLintResults({
      packageJsonLintResult: linterResult
    })));
  }

  return value();
};

export {
  lintPackageJson
};


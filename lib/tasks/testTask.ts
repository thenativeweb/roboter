import { buntstift } from 'buntstift';
import { fileExists } from '../utils/fileExists';
import { findMochaConfigurationfile } from '../steps/test/findMochaConfigurationFile';
import { getSubDirectoryNames } from '../utils/getSubDirectoryNames';
import globby from 'globby';
import { loadEnvironmentVariables } from '../steps/test/loadEnvironmentVariables';
import path from 'path';
import { testCode } from '../steps/test/testCode';
import { Result, value } from 'defekt';
import * as errors from '../errors';

const testTask = async function ({ applicationRoot, type }: {
  applicationRoot: string;
  type?: string;
}): Promise<Result<undefined, errors.TestsFailed>> {
  buntstift.line();
  buntstift.info(`Running tests...`, { prefix: '▸' });

  const absoluteTestDirectory = path.join(applicationRoot, 'test');
  const doesTestDirectoryExist = await fileExists({
    absoluteFile: absoluteTestDirectory
  });

  if (!doesTestDirectoryExist) {
    buntstift.line();
    buntstift.warn('No test directory found, skipping tests.');

    return value();
  }

  const ignoredDirectories = new Set([ 'shared' ]),
        preferredTypes = [ 'unit', 'component', 'integration', 'e2e', 'performance' ];
  let types = [ type ?? await getSubDirectoryNames({ directory: absoluteTestDirectory }) ].flat();

  types = types.filter((currentType): boolean => !ignoredDirectories.has(currentType));

  preferredTypes.reverse().forEach((preferredType): void => {
    const index = types.indexOf(preferredType);

    if (index !== -1) {
      types.splice(index, 1);
      types.unshift(preferredType);
    }
  });

  for (const currentType of types) {
    buntstift.line();
    buntstift.info(`Running ${currentType} tests...`);

    const absoluteTestTypeDirectory = path.join(
      applicationRoot, 'test', currentType
    );

    const absoluteTestFiles = await globby(
      [
        path.posix.join('test', currentType, '**', '*Tests.js'),
        path.posix.join('test', currentType, '**', '*Tests.jsx'),
        path.posix.join('test', currentType, '**', '*Tests.ts'),
        path.posix.join('test', currentType, '**', '*Tests.tsx')
      ],
      {
        absolute: true,
        cwd: applicationRoot,
        onlyFiles: true
      }
    );

   const environmentVariablesForTest = await loadEnvironmentVariables({
      directory: absoluteTestTypeDirectory
    });

    const absoluteMochaConfigurationFile = await findMochaConfigurationfile({
      directory: absoluteTestTypeDirectory
    });

    const testCodeResult = await testCode({
      environmentVariables: environmentVariablesForTest,
      absoluteMochaConfigurationFile,
      absoluteTestFiles
    });

    if (testCodeResult.hasError()) {
      buntstift.error('Tests failed.');

      return testCodeResult;
    }

    buntstift.line();
    buntstift.success(`${currentType} tests successful.`);
  }

  buntstift.line();
  buntstift.success('Tests successful.');

  return value();
};

export {
  testTask
};

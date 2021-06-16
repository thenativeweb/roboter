import { buntstift } from 'buntstift';
import chokidar from 'chokidar';
import { fileExists } from '../utils/fileExists';
import { getSubDirectoryNames } from '../utils/getSubDirectoryNames';
import path from 'path';
import { TestRunner } from '../runner/TestRunner';
import { Result, value } from 'defekt';
import * as errors from '../errors';

const testTask = async function ({ applicationRoot, type, watch }: {
  applicationRoot: string;
  type?: string;
  watch: boolean;
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

  const testRunner = new TestRunner({
    applicationRoot,
    types,
    bail: true
  });

  if (!watch) {
    const testResult = await testRunner.run();

    if (testResult.hasError()) {
      buntstift.error('Tests failed.');

      return testResult;
    }

    buntstift.line();
    buntstift.success('Tests successful.');

    return value();
  }

  const fileWatcher = chokidar.watch(
    [
      path.join(applicationRoot, '**', '*.js'),
      path.join(applicationRoot, '**', '*.jsx'),
      path.join(applicationRoot, '**', '*.ts'),
      path.join(applicationRoot, '**', '*.tsx')
    ],
    {
      ignored: [
        'node_modules',
        '.git'
      ],
      persistent: true
    }
  );

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  testRunner.run();

  fileWatcher.on('ready', (): void => {
    fileWatcher.on('all', async (): Promise<void> => {
      await testRunner.abort();
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      testRunner.run();
    });
  });

  return value();
};

export {
  testTask
};

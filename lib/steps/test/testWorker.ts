import { buntstift } from 'buntstift';
import { findMochaConfigurationfile } from './findMochaConfigurationFile';
import globby from 'globby';
import { loadEnvironmentVariables } from './loadEnvironmentVariables';
import Mocha from 'mocha';
import { nodeenv } from 'nodeenv';
import path from 'path';
import { parentPort, workerData } from 'worker_threads';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async (): Promise<void> => {
  const {
    applicationRoot,
    types,
    bail
  } = workerData;

  for (const currentType of types) {
    buntstift.line();
    buntstift.info(`Running ${currentType} tests...`);

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

    const absoluteTestTypeDirectory = path.join(
      applicationRoot, 'test', currentType
    );

    const environmentVariablesForTest = await loadEnvironmentVariables({
      directory: absoluteTestTypeDirectory
    });

    const absoluteMochaConfigurationFile = await findMochaConfigurationfile({
      directory: absoluteTestTypeDirectory
    });

    let additionalMochaConfiguration = {};

    if (absoluteMochaConfigurationFile) {
      additionalMochaConfiguration = (await import(absoluteMochaConfigurationFile)).default;
    }

    const mocha = new Mocha({
      asyncOnly: true,
      bail,
      color: true,
      reporter: 'spec',
      ui: 'tdd',
      ...additionalMochaConfiguration
    });

    for (const absoluteFile of absoluteTestFiles) {
      mocha.addFile(absoluteFile);
    }

    await mocha.loadFilesAsync();

    const resetEnvironment = nodeenv(environmentVariablesForTest);

    const runner = mocha.run();

    await new Promise<void>((resolve): void => {
      runner.on('end', (): void => resolve());
    });

    runner.dispose();
    mocha.unloadFiles();
    mocha.dispose();

    resetEnvironment();

    if (runner.failures > 0) {
      buntstift.error(`${currentType} tests failed.`);

      parentPort?.postMessage(false);

      return;
    }

    buntstift.line();
    buntstift.success(`${currentType} tests successful.`);
  }

  parentPort?.postMessage(true);
})();

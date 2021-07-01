import { buntstift } from 'buntstift';
import { findMochaConfigurationfile } from './findMochaConfigurationFile';
import { loadEnvironmentVariables } from './loadEnvironmentVariables';
import Mocha from 'mocha';
import { nodeenv } from 'nodeenv';
import path from 'path';
import { parentPort, workerData } from 'worker_threads';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async (): Promise<void> => {
  const {
    applicationRoot,
    absoluteTestFilesPerType,
    typeSequence,
    bail,
    grep
  } = workerData;

  for (const testType of typeSequence) {
    buntstift.line();
    buntstift.info(`Running ${testType} tests...`);

    const absoluteTestFiles = absoluteTestFilesPerType[testType];

    const absoluteTestTypeDirectory = path.join(
      applicationRoot, 'test', testType
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
      grep,
      ...additionalMochaConfiguration
    });

    for (const absoluteFile of absoluteTestFiles) {
      mocha.addFile(absoluteFile);
    }

    await mocha.loadFilesAsync();

    const resetEnvironment = nodeenv(environmentVariablesForTest);

    const runner = mocha.run();

    runner.on('fail', (test): void => {
      buntstift.raw(test.err!.stack!);
    });

    await new Promise<void>((resolve): void => {
      runner.on('end', (): void => resolve());
    });

    runner.dispose();
    mocha.unloadFiles();
    mocha.dispose();

    resetEnvironment();

    if (runner.failures > 0) {
      buntstift.error(`${testType} tests failed.`);

      parentPort?.postMessage(false);

      return;
    }

    buntstift.line();
    buntstift.success(`${testType} tests successful.`);
  }

  parentPort?.postMessage(true);
})();

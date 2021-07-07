import { buntstift } from 'buntstift';
import { findMochaConfigurationfile } from './findMochaConfigurationFile';
import { loadEnvironmentVariables } from './loadEnvironmentVariables';
import Mocha, { Suite, Test } from 'mocha';
import { nodeenv } from 'nodeenv';
import path from 'path';
import {
  loadGlobalPostScript,
  loadGlobalPreScript,
  loadTestTypePostScript,
  loadTestTypePreScript
} from './loadTestScript';
import { parentPort, workerData } from 'worker_threads';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async (): Promise<void> => {
  const {
    applicationRoot,
    absoluteTestFilesPerType,
    typeSequence,
    bail,
    grep,
    watch,
    previousRunResult
  } = workerData;

  const globalPreScript = await loadGlobalPreScript({ applicationRoot });

  let globalPreScriptResult: any;

  if (globalPreScript) {
    buntstift.line();
    buntstift.info('Running global pre script...');
    globalPreScriptResult = await globalPreScript({
      runNumber: 0,
      isBailActive: bail,
      isWatchModeActive: watch,
      previousRunResult
    });
  }

  let entireRunHadFailure = false;

  for (const testType of typeSequence) {
    let currentTestTypeHadFailure = false;

    const testTypePreScript = await loadTestTypePreScript({ applicationRoot, testType });

    let testTypePreScriptResult: any;

    if (testTypePreScript) {
      buntstift.line();
      buntstift.info(`Running pre script for ${testType} tests...`);
      testTypePreScriptResult = await testTypePreScript({
        runNumber: 0,
        isBailActive: bail,
        isWatchModeActive: watch,
        previousRunResult
      });
    }

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

    const roboterContext = {
      ...globalPreScriptResult,
      ...testTypePreScriptResult
    };

    const suites: Suite[] = [ mocha.suite ];
    const tests: Test[] = [];

    while (suites.length > 0) {
      const currentSuite = suites.pop()!;

      currentSuite.ctx.roboter = roboterContext;

      suites.push(...currentSuite.suites);
      tests.push(...currentSuite.tests);
    }

    for (const test of tests) {
      test.ctx!.roboter = roboterContext;
    }

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
      entireRunHadFailure = true;
      currentTestTypeHadFailure = true;

      buntstift.error(`${testType} tests failed.`);
    } else {
      buntstift.line();
      buntstift.success(`${testType} tests successful.`);
    }

    const testTypePostScript = await loadTestTypePostScript({ applicationRoot, testType });

    if (testTypePostScript) {
      buntstift.line();
      buntstift.info(`Running post script for ${testType} tests...`);
      await testTypePostScript({
        runNumber: 0,
        isBailActive: bail,
        isWatchModeActive: watch,
        currentRunResult: currentTestTypeHadFailure ? 'fail' : 'success'
      });
    }

    if (currentTestTypeHadFailure && bail) {
      break;
    }
  }

  const globalPostScript = await loadGlobalPostScript({ applicationRoot });

  if (globalPostScript) {
    buntstift.line();
    buntstift.info('Running global post script...');
    await globalPostScript({
      runNumber: 0,
      isBailActive: bail,
      isWatchModeActive: watch,
      currentRunResult: entireRunHadFailure ? 'fail' : 'success'
    });
  }

  if (entireRunHadFailure) {
    if (bail) {
      parentPort?.postMessage('bail');
    } else {
      parentPort?.postMessage('fail');
    }
  } else {
    parentPort?.postMessage('success');
  }
})();

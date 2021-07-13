import { buntstift } from 'buntstift';
import { doesMochaInstanceHaveTests } from './isMochaInstanceEmpty';
import { findMochaConfigurationfile } from './findMochaConfigurationFile';
import { loadEnvironmentVariables } from './loadEnvironmentVariables';
import { nodeenv } from 'nodeenv';
import path from 'path';
import { pruneMochaInstanceByGrep } from './pruneMochaInstanceByGrep';
import {
  loadGlobalPostScript,
  loadGlobalPreScript,
  loadTestTypePostScript,
  loadTestTypePreScript
} from './loadTestScript';
import Mocha, { Suite, Test } from 'mocha';
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
    previousRunResult,
    runNumber
  } = workerData;

  const globalPreScript = await loadGlobalPreScript({ applicationRoot });

  let globalPreScriptResult: any;

  if (globalPreScript) {
    buntstift.line();
    buntstift.info('Running global pre script...');
    try {
      globalPreScriptResult = await globalPreScript({
        runNumber,
        isBailActive: bail,
        isWatchModeActive: watch,
        previousRunResult
      });
    } catch (ex: unknown) {
      buntstift.error(`Global pre script failed.`);
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      buntstift.raw((ex as Error).toString());
    }
  }

  let entireRunHadFailure = false;

  for (const testType of typeSequence) {
    const absoluteTestFiles = absoluteTestFilesPerType[testType];

    if (!absoluteTestFiles || absoluteTestFiles.length === 0) {
      continue;
    }

    let currentTestTypeHadFailure = false;

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
      ...additionalMochaConfiguration
    });

    for (const absoluteFile of absoluteTestFiles) {
      mocha.addFile(absoluteFile);
    }

    await mocha.loadFilesAsync();

    pruneMochaInstanceByGrep({ mocha, grep });

    if (!doesMochaInstanceHaveTests({ mocha })) {
      continue;
    }

    const testTypePreScript = await loadTestTypePreScript({ applicationRoot, testType });

    let testTypePreScriptResult: any;

    if (testTypePreScript) {
      buntstift.line();
      buntstift.info(`Running pre script for ${testType} tests...`);
      try {
        testTypePreScriptResult = await testTypePreScript({
          runNumber,
          isBailActive: bail,
          isWatchModeActive: watch,
          previousRunResult
        });
      } catch (ex: unknown) {
        buntstift.error(`Pre script for ${testType} tests failed.`);
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        buntstift.raw((ex as Error).toString());
      }
    }

    buntstift.line();
    buntstift.info(`Running ${testType} tests...`);

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
      try {
        await testTypePostScript({
          runNumber,
          isBailActive: bail,
          isWatchModeActive: watch,
          currentRunResult: currentTestTypeHadFailure ? 'fail' : 'success',
          preScriptData: roboterContext
        });
      } catch (ex: unknown) {
        buntstift.error(`Post script for ${testType} tests failed.`);
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        buntstift.raw((ex as Error).toString());
      }
    }

    if (currentTestTypeHadFailure && bail) {
      break;
    }
  }

  const globalPostScript = await loadGlobalPostScript({ applicationRoot });

  if (globalPostScript) {
    buntstift.line();
    buntstift.info('Running global post script...');
    try {
      await globalPostScript({
        runNumber,
        isBailActive: bail,
        isWatchModeActive: watch,
        currentRunResult: entireRunHadFailure ? 'fail' : 'success',
        preScriptData: globalPreScriptResult
      });
    } catch (ex: unknown) {
      buntstift.error(`Global post script failed.`);
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      buntstift.raw((ex as Error).toString());
    }
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

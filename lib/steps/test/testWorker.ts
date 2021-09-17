import { doesMochaInstanceHaveTests } from './isMochaInstanceEmpty';
import { findMochaConfigurationfile } from './findMochaConfigurationFile';
import { loadEnvironmentVariables } from './loadEnvironmentVariables';
import { nodeenv } from 'nodeenv';
import path from 'path';
import { pruneMochaInstanceByGrep } from './pruneMochaInstanceByGrep';
import { TestWorkerMessage } from './TestWorkerMessage';
import {
  loadGlobalPostScript,
  loadGlobalPreScript,
  loadTestTypePostScript,
  loadTestTypePreScript
} from './loadTestScript';
import Mocha, { Suite, Test } from 'mocha';
import { parentPort, workerData } from 'worker_threads';

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

const postMessage = function (message: TestWorkerMessage): void {
  parentPort?.postMessage(message);
};

const globalPreScript = await loadGlobalPreScript({ applicationRoot });

let globalPreScriptResult: any;

if (globalPreScript) {
  postMessage({ type: 'buntstift', buntstiftMethod: 'line' });
  postMessage({ type: 'buntstift', buntstiftMethod: 'info', value: 'Running global pre script...' });
  try {
    globalPreScriptResult = await globalPreScript({
      runNumber,
      isBailActive: bail,
      isWatchModeActive: watch,
      previousRunResult
    });
  } catch (ex: unknown) {
    postMessage({ type: 'buntstift', buntstiftMethod: 'error', value: 'Global pre script failed.' });
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    postMessage({ type: 'buntstift', buntstiftMethod: 'raw', value: (ex as Error).toString() });
  }
} else {
  globalPreScriptResult = {};
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
    additionalMochaConfiguration = (await import(`file://${absoluteMochaConfigurationFile}`)).default;
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
    postMessage({ type: 'buntstift', buntstiftMethod: 'line' });
    postMessage({ type: 'buntstift', buntstiftMethod: 'info', value: `Running pre script for ${testType} tests...` });
    try {
      testTypePreScriptResult = await testTypePreScript({
        runNumber,
        isBailActive: bail,
        isWatchModeActive: watch,
        previousRunResult
      });
    } catch (ex: unknown) {
      postMessage({ type: 'buntstift', buntstiftMethod: 'error', value: `Pre script for ${testType} tests failed.` });
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      postMessage({ type: 'buntstift', buntstiftMethod: 'raw', value: (ex as Error).toString() });
    }
  } else {
    testTypePreScriptResult = {};
  }

  postMessage({ type: 'buntstift', buntstiftMethod: 'line' });
  postMessage({ type: 'buntstift', buntstiftMethod: 'info', value: `Running ${testType} tests...` });

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
    postMessage({ type: 'buntstift', buntstiftMethod: 'raw', value: test.err!.stack! });
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

    postMessage({ type: 'buntstift', buntstiftMethod: 'error', value: `${testType} tests failed.` });
  } else {
    postMessage({ type: 'buntstift', buntstiftMethod: 'line' });
    postMessage({ type: 'buntstift', buntstiftMethod: 'info', value: `${testType} tests successful.` });
  }

  const testTypePostScript = await loadTestTypePostScript({ applicationRoot, testType });

  if (testTypePostScript) {
    postMessage({ type: 'buntstift', buntstiftMethod: 'line' });
    postMessage({ type: 'buntstift', buntstiftMethod: 'info', value: `Running post script for ${testType} tests...` });
    try {
      await testTypePostScript({
        runNumber,
        isBailActive: bail,
        isWatchModeActive: watch,
        currentRunResult: currentTestTypeHadFailure ? 'fail' : 'success',
        preScriptData: roboterContext
      });
    } catch (ex: unknown) {
      postMessage({ type: 'buntstift', buntstiftMethod: 'error', value: `Post script for ${testType} tests failed.` });
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      postMessage({ type: 'buntstift', buntstiftMethod: 'raw', value: (ex as Error).toString() });
    }
  }

  if (currentTestTypeHadFailure && bail) {
    break;
  }
}

const globalPostScript = await loadGlobalPostScript({ applicationRoot });

if (globalPostScript) {
  postMessage({ type: 'buntstift', buntstiftMethod: 'line' });
  postMessage({ type: 'buntstift', buntstiftMethod: 'info', value: 'Running global post script...' });
  try {
    await globalPostScript({
      runNumber,
      isBailActive: bail,
      isWatchModeActive: watch,
      currentRunResult: entireRunHadFailure ? 'fail' : 'success',
      preScriptData: globalPreScriptResult
    });
  } catch (ex: unknown) {
    postMessage({ type: 'buntstift', buntstiftMethod: 'error', value: 'Global post script failed.' });
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    postMessage({ type: 'buntstift', buntstiftMethod: 'raw', value: (ex as Error).toString() });
  }
}

if (entireRunHadFailure) {
  if (bail) {
    postMessage({ type: 'final-status', value: 'bail' });
  } else {
    postMessage({ type: 'final-status', value: 'fail' });
  }
} else {
  postMessage({ type: 'final-status', value: 'success' });
}

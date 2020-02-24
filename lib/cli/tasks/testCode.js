'use strict';

const path = require('path');

const { isTypeScript } = require('is-typescript');

const files = require('../../files'),
      loadEnvironmentVariables = require('../../steps/test/loadEnvironmentVariables'),
      runLifecycleStep = require('../../steps/test/runLifecycleStep'),
      runPreOrPostTask = require('./runPreOrPostTask'),
      testCodeStep = require('../../steps/test/testCode');

const testCodeTask = async function ({ directory, type, ui }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }
  if (!ui) {
    throw new Error('UI is missing.');
  }

  const testDirectory = path.join(directory, 'test');

  try {
    await runPreOrPostTask({ directory, ui, task: 'test', phase: 'pre' });

    ui.printTaskHeader('tests');

    const doesTestDirectoryExist = await files.exists({ path: testDirectory });

    if (!doesTestDirectoryExist) {
      ui.printTaskOmission('No test directory found, skipping tests.');

      return;
    }

    const testTypeScriptFiles = await isTypeScript({ directory });

    const ignoredDirectories = [ 'shared' ],
          preferredTypes = [ 'unit', 'integration', 'e2e', 'performance' ];
    let types = [ type || await files.getSubDirectories({ directory: testDirectory }) ].flat();

    types = types.filter(currentType => !ignoredDirectories.includes(currentType));

    preferredTypes.reverse().forEach(preferredType => {
      const index = types.indexOf(preferredType);

      if (index !== -1) {
        types.splice(index, 1);
        types.unshift(preferredType);
      }
    });

    ui.printTaskHeader(`global pre step`);
    await runLifecycleStep({
      directory: path.join(testDirectory),
      step: 'pre'
    });

    for (const currentType of types) {
      ui.printTaskHeader(`${currentType} tests`);

      const testFiles = await files.get({
        directory,
        pattern: [
          `test/${currentType}/**/*Tests.${testTypeScriptFiles ? 't' : 'j'}s`,
          `test/${currentType}/**/*Tests.${testTypeScriptFiles ? 't' : 'j'}sx`
        ]
      });

      if (!testFiles || testFiles.length === 0) {
        ui.warn('No tests found.');

        return;
      }

      const environmentVariables = await loadEnvironmentVariables({ directory: path.join(testDirectory, currentType) });

      ui.printTaskHeader(`pre step`);
      await runLifecycleStep({
        directory: path.join(testDirectory, currentType),
        step: 'pre',
        environmentVariables
      });

      try {
        await testCodeStep({
          environmentVariables,
          directory,
          testFiles: [
            `test/${currentType}/**/*Tests.${testTypeScriptFiles ? 't' : 'j'}s`,
            `test/${currentType}/**/*Tests.${testTypeScriptFiles ? 't' : 'j'}sx`
          ],
          type: currentType
        });
      } finally {
        ui.printTaskHeader(`post step`);
        await runLifecycleStep({
          directory: path.join(testDirectory, currentType),
          step: 'post',
          environmentVariables
        });
      }

      ui.printTaskSuccess(`${currentType} tests successful.`);
    }

    ui.printTaskSuccess('Tests successful.');

    await runPreOrPostTask({ directory, ui, task: 'test', phase: 'post' });
  } catch (ex) {
    switch (ex.code) {
      case 'ETESTSFAILED':
        ui.printTaskFailure('Tests failed.');
        throw ex;
      default:
        ui.error('Failed to run tests.');
        throw ex;
    }
  } finally {
    ui.printTaskHeader(`global post step`);
    await runLifecycleStep({
      directory: path.join(testDirectory),
      step: 'post'
    });
  }
};

testCodeTask.getFiles = async function ({ directory }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }

  return await testCodeStep.getFiles({ directory });
};

module.exports = testCodeTask;

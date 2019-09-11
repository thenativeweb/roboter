'use strict';

const path = require('path');

const processenv = require('processenv').default,
      shell = require('shelljs');

const files = require('../../files');

const runLifecycleStep = async function ({ directory, step, ui, environmentVariables = {}}) {
  if (!directory) {
    throw new Error('Directory is misssing.');
  }
  if (!step) {
    throw new Error('Step is misssing.');
  }
  if (!ui) {
    throw new Error('UI is misssing.');
  }

  const jsStepFile = path.join(directory, `${step}.js`);
  const jsStepExists = await files.exists({ path: jsStepFile });
  const tsStepFile = path.join(directory, `${step}.ts`);
  const tsStepExists = await files.exists({ path: tsStepFile });

  if (!jsStepExists && !tsStepExists) {
    return;
  }

  ui.printTaskHeader(`${step} step`);

  const mergedEnvironmentVariables = {
    ...processenv(),
    ...environmentVariables
  };

  if (jsStepExists) {
    const jsStep = shell.exec(`node ${jsStepFile}`, {
      cwd: directory,
      env: mergedEnvironmentVariables
    });

    if (jsStep.code !== 0) {
      throw new Error(`${step} step execution failed.`);
    }
  } else if (tsStepExists) {
    const tsPre = shell.exec(`ts-node -r tsconfig-paths/register ${tsStepFile}`, {
      cwd: directory,
      env: mergedEnvironmentVariables
    });

    if (tsPre.code !== 0) {
      throw new Error(`${step} step execution failed.`);
    }
  }
};

module.exports = runLifecycleStep;

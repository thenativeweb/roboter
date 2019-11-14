'use strict';

const path = require('path');

const { processenv } = require('processenv'),
      shell = require('shelljs');

const errors = require('../../errors'),
      files = require('../../files');

const runLifecycleStep = async function ({ directory, step, environmentVariables = {}}) {
  if (!directory) {
    throw new Error('Directory is misssing.');
  }
  if (!step) {
    throw new Error('Step is misssing.');
  }

  const jsStepFile = path.join(directory, `${step}.js`);
  const jsStepExists = await files.exists({ path: jsStepFile });
  const tsStepFile = path.join(directory, `${step}.ts`);
  const tsStepExists = await files.exists({ path: tsStepFile });

  if (!jsStepExists && !tsStepExists) {
    return;
  }

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
      throw new errors.StepExecutionFailed(`${step} step execution failed.`);
    }
  } else if (tsStepExists) {
    const tsPre = shell.exec(`ts-node -r tsconfig-paths/register ${tsStepFile}`, {
      cwd: directory,
      env: mergedEnvironmentVariables
    });

    if (tsPre.code !== 0) {
      throw new errors.StepExecutionFailed(`${step} step execution failed.`);
    }
  }
};

module.exports = runLifecycleStep;

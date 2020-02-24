'use strict';

const { isTypeScript } = require('is-typescript');

const compileTypeScript = require('../../steps/build/compileTypeScript'),
      errors = require('../../errors'),
      runPreOrPostTask = require('./runPreOrPostTask');

const buildTask = async function ({ directory, ui }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }
  if (!ui) {
    throw new Error('UI is missing.');
  }

  try {
    await runPreOrPostTask({ directory, ui, task: 'build', phase: 'pre' });

    ui.printTaskHeader('build');

    if (!await isTypeScript({ directory })) {
      ui.warn('No TypeScript found, skipping build.');

      return;
    }

    await compileTypeScript({ directory });

    ui.printTaskSuccess('Successfully built sources.');

    await runPreOrPostTask({ directory, ui, task: 'build', phase: 'post' });
  } catch (ex) {
    switch (ex.code) {
      case 'ETYPESCRIPTOUTPUTCONFIGURATIONMISSING':
        ui.warn('TypeScript compilation failed because no output directory is configured.');
        throw new errors.BuildFailed(ex.message);
      default:
        ui.printTaskFailure('Failed to build.');
        throw ex;
    }
  }
};

module.exports = buildTask;

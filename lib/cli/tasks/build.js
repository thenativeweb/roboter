'use strict';

const isTypeScript = require('is-typescript').default;

const compileTypeScript = require('../../steps/build/compileTypeScript'),
      errors = require('../../errors');

const buildTask = async function ({ directory, ui }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }
  if (!ui) {
    throw new Error('UI is missing.');
  }

  ui.printTaskHeader('build');

  try {
    if (!await isTypeScript({ directory })) {
      ui.warn('No TypeScript found, skipping build.');

      return;
    }

    await compileTypeScript({ directory });

    ui.printTaskSuccess('Successfully built sources.');
  } catch (ex) {
    switch (ex.code) {
      case 'ETYPESCRIPTOUTPUTNOTCONFIGURED':
        ui.warn('Skipping TypeScript compilation because no output directory is configured.');
        break;
      default:
        ui.printTaskFailure('Failed to build.');
        throw ex;
    }
    throw new errors.BuildFailed();
  }
};

module.exports = buildTask;

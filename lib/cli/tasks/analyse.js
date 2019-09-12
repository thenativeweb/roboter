'use strict';

const errors = require('../../errors'),
      lintCode = require('../../steps/analyse/lintCode');

const analyseTask = async function ({ directory, ui }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }
  if (!ui) {
    throw new Error('UI is missing.');
  }

  ui.printTaskHeader('code analysis');

  try {
    await lintCode({ directory });

    ui.printTaskSuccess('Code analysis successful.');
  } catch (ex) {
    switch (ex.code) {
      case 'ENOCODEFOUND':
        ui.printTaskOmission('No code found, skipping code analysis.');
        break;
      case 'ECODEMALFORMED':
        ui.printTaskFailure('Malformed code found.');
        throw new errors.CodeAnalysisFailed();
      default:
        ui.printTaskFailure('Failed to run code analysis.');
        throw ex;
    }
  }
};

analyseTask.getFiles = async function ({ directory }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }

  return await lintCode.getFiles({ directory });
};

module.exports = analyseTask;

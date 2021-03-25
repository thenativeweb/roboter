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

  try {
    ui.printTaskHeader('code analysis');
    await lintCode({ directory });
    ui.printTaskSuccess('Code analysis successful.');
  } catch (ex) {
    switch (ex.code) {
      case errors.NoCodeFound.code:
        ui.printTaskOmission('No code found, skipping code analysis.');
        break;
      case errors.CodeMalformed.code:
        ui.printTaskFailure('Malformed code found.');
        throw new errors.AnalysisFailed(ex.message);
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

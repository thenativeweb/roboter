'use strict';

const checkForOutdatedDependencies = require('../../steps/dependencies/checkForOutdatedDependencies'),
      checkForUnusedDependencies = require('../../steps/dependencies/checkForUnusedDependencies'),
      errors = require('../../errors');

const dependenciesTask = async function ({ directory, ui }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }
  if (!ui) {
    throw new Error('UI is missing.');
  }

  ui.printTaskHeader('dependency check');

  try {
    ui.printTaskHeader('unused or missing dependencies check');
    await checkForUnusedDependencies({ directory });

    ui.printTaskHeader('outdated dependencies check');
    await checkForOutdatedDependencies({ directory });

    ui.printTaskSuccess('Dependency check successful.');
  } catch (ex) {
    switch (ex.code) {
      case 'EFILEPARSINGFAILED':
      case 'EDIRECTORYACCESSFAILED':
        ui.info(ex.message);
        throw new errors.DependencyCheckFailed(ex.message);
      case 'EUNUSEDDEPENDENCIES':
        ui.info(ex.message);
        break;
      case 'EOUTDATEDDEPENDENCIES':
        ui.warn('You have outdated dependencies.');
        break;
      default:
        ui.printTaskFailure('Failed to check for unused dependencies.');
        throw ex;
    }
  }
};

module.exports = dependenciesTask;

'use strict';

const errors = require('../../errors'),
      shell = require('../../shell');

const checkForOutdatedDependencies = async function ({ directory, ui }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }
  if (!ui) {
    throw new Error('UI is missing.');
  }

  ui.printTaskHeader('outdated dependencies check');

  try {
    await shell.execLive('npm outdated', {
      cwd: directory,
      silent: false
    });
  } catch (ex) {
    // Ignore the exception since we just want to print out a warning here.
    if (/Package +Current +Wanted +Latest +Location/u.test(ex.stdout)) {
      ui.warn('You have outdated dependencies.');

      throw new errors.OutdatedDependencies();
    }

    throw ex;
  }
};

module.exports = checkForOutdatedDependencies;

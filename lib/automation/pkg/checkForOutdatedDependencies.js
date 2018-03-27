'use strict';

const shell = require('../../shell');

const checkForOutdatedDependencies = async function ({ directory }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }

  try {
    await shell.execLive('npm outdated', {
      cwd: directory,
      silent: false
    });
  } catch (ex) {
    // Ignore the exception since we just want to print out a warning here.
    if (/Package +Current +Wanted +Latest +Location/.test(ex.stdout)) {
      return;
    }

    throw ex;
  }
};

module.exports = checkForOutdatedDependencies;

'use strict';

const shell = require('../shell');

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
    if (ex.stdout.includes('Package  Current  Wanted  Latest  Location')) {
      return;
    }

    throw ex;
  }
};

module.exports = checkForOutdatedDependencies;

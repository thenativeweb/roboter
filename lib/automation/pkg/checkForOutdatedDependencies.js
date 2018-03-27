'use strict';

const buntstift = require('buntstift');

const errors = require('../../errors'),
      shell = require('../../shell');

const checkForOutdatedDependencies = async function ({ directory }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }

  buntstift.line();
  buntstift.info('Checking for outdated dependencies...', { prefix: '▸' });

  try {
    await shell.execLive('npm outdated', {
      cwd: directory,
      silent: false
    });
  } catch (ex) {
    // Ignore the exception since we just want to print out a warning here.
    if (/Package +Current +Wanted +Latest +Location/.test(ex.stdout)) {
      throw new errors.OutdatedDependencies();
    }

    throw ex;
  }
};

module.exports = checkForOutdatedDependencies;

'use strict';

const errors = require('../../errors'),
      runCommand = require('../../runCommand');

const checkForOutdatedDependencies = async function ({ directory }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }

  try {
    await runCommand('npm outdated', {
      cwd: directory
    });
  } catch (ex) {
    if (/Package +Current +Wanted +Latest +Location/u.test(ex.stdout)) {
      throw new errors.OutdatedDependencies();
    }

    throw ex;
  }
};

module.exports = checkForOutdatedDependencies;

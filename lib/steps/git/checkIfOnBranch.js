'use strict';

const errors = require('../../errors'),
      getCurrentBranch = require('./getCurrentBranch');

const checkIfOnBranch = async function ({ directory, branch }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }
  if (!branch) {
    throw new Error('Branch is missing.');
  }

  const currentBranch = await getCurrentBranch({ directory });

  if (currentBranch !== branch) {
    throw new errors.NotOnExpectedBranch(`Current branch is ${currentBranch}, but should be ${branch}.`);
  }
};

module.exports = checkIfOnBranch;

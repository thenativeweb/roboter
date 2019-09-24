'use strict';

const errors = require('../../errors'),
      gitSteps = require('../../steps/git');

const isGitInUpdateableState = async function ({ directory, ui }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }
  if (!ui) {
    throw new Error('UI is missing.');
  }

  try {
    ui.printTaskHeader('check for pending changes');
    await gitSteps.checkForPendingChanges({ directory });

    ui.printTaskHeader('check for pending changes');
    const currentBranch = gitSteps.getCurrentBranch({ directory });

    ui.printTaskHeader(`local/${currentBranch} branch check`);
    await gitSteps.checkIfLocalBranchIsBehindRemote({ directory, branch: 'master' });
  } catch (ex) {
    switch (ex.code) {
      case 'EPENDINGCHANGES':
        ui.printTaskFailure('You have pending changes, commit your changes first.');
        throw new errors.GitNotInUpdateableState();
      case 'ELOCALBRANCHBEHINDREMOTE':
        ui.printTaskFailure(`The current branch is behind its remote branch, run 'git pull' first.`);
        throw new errors.GitNotInUpdateableState();
      default:
        ui.printTaskFailure('Failed to check if git is in updateable state.');
        throw ex;
    }
  }
};

module.exports = isGitInUpdateableState;

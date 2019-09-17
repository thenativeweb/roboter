'use strict';

const errors = require('../../errors'),
      gitSteps = require('../../steps/release/git');

const isGitInReleasableStateTask = async function ({ directory, ui }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }
  if (!ui) {
    throw new Error('UI is missing.');
  }

  try {
    ui.printTaskHeader('check for master branch');
    await gitSteps.checkIfOnMaster({ directory, ui });

    ui.printTaskHeader('check for pending changes');
    await gitSteps.checkForPendingChanges({ directory });

    ui.printTaskHeader('local/master branch check');
    await gitSteps.checkIfLocalMasterIsBehindRemote({ directory, ui });
  } catch (ex) {
    switch (ex.code) {
      case 'ENOTONLOCALMASTER':
        ui.printTaskFailure(`You must be on the 'master' branch, run 'git checkout master' first.`);
        throw new errors.GitNotInReleasableState();
      case 'EPENDINGCHANGES':
        ui.printTaskFailure('You have pending changes, commit your changes first.');
        throw new errors.GitNotInReleasableState();
      case 'ELOCALMASTERBEHINDREMOTE':
        ui.printTaskFailure(`The local master branch is behind origin/master, run 'git pull' first.`);
        throw new errors.GitNotInReleasableState();
      default:
        ui.printTaskFailure('Failed to check if git is in releasable state.');
        throw ex;
    }
  }
};

module.exports = isGitInReleasableStateTask;

'use strict';

const errors = require('../../errors'),
      runCommand = require('../../runCommand');

const checkIfLocalBranchIsBehindRemote = async function ({ directory, branch }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }
  if (!branch) {
    throw new Error('Branch is missing.');
  }

  await runCommand('git fetch', { cwd: directory });

  let behind;

  try {
    behind = await runCommand(`git rev-list --right-only --count ${branch}...origin/${branch}`, { cwd: directory, silent: true });
  } catch {
    throw new Error('Failed to compare branches.');
  }

  if (behind.stdout.trim() !== '0') {
    throw new errors.LocalBranchBehindRemote();
  }
};

module.exports = checkIfLocalBranchIsBehindRemote;

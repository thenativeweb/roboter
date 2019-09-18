'use strict';

const errors = require('../../../errors'),
      runCommand = require('../../../runCommand');

const checkIfLocalMasterIsBehindRemote = async function ({ directory }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }

  await runCommand('git fetch', { cwd: directory });

  let behind;

  try {
    behind = await runCommand('git rev-list --right-only --count master...origin/master', { cwd: directory, silent: true });
  } catch {
    throw new Error('Failed to compare branches.');
  }

  if (behind.stdout.trim() !== '0') {
    throw new errors.LocalMasterBehindRemote();
  }
};

module.exports = checkIfLocalMasterIsBehindRemote;

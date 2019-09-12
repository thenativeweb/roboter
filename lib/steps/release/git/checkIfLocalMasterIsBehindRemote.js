'use strict';

const errors = require('../../../errors'),
      runCommand = require('../../../runCommand');

const checkIfLocalMasterIsBehindRemote = async function ({ directory, ui }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }
  if (!ui) {
    throw new Error('UI is missing.');
  }

  ui.printTaskHeader('local/master branch check');

  await runCommand('git fetch', { cwd: directory });

  let behind;

  try {
    behind = await runCommand('git rev-list --right-only --count master...origin/master', { cwd: directory });
  } catch {
    throw new Error('Failed to compare branches.');
  }

  if (behind.stdout.trim() !== '0') {
    throw new errors.LocalMasterBehindRemote();
  }
};

module.exports = checkIfLocalMasterIsBehindRemote;

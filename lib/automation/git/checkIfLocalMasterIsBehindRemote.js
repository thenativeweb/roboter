'use strict';

const errors = require('../../errors'),
      shell = require('../../shell');

const checkIfLocalMasterIsBehindRemote = async function ({ directory, ui }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }
  if (!ui) {
    throw new Error('UI is missing.');
  }

  ui.printTaskHeader('local/master branch check');

  await shell.execLive('git fetch', { cwd: directory, silent: true });

  const behind = await shell.execLive('git rev-list --right-only --count master...origin/master', { cwd: directory, silent: true });

  if (behind.exitCode !== 0) {
    throw new Error('Failed to compare branches.');
  }

  if (behind.stdout.trim() !== '0') {
    throw new errors.LocalMasterBehindRemote();
  }
};

module.exports = checkIfLocalMasterIsBehindRemote;

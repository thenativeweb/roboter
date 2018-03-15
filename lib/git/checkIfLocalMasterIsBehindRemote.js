'use strict';

const errors = require('../errors'),
      execLive = require('../shell/execLive');

const checkIfLocalMasterIsBehindRemote = async function ({ directory }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }

  await execLive('git fetch', { cwd: directory, silent: true });

  const behind = await execLive('git rev-list --right-only --count master...origin/master', { cwd: directory, silent: true });

  if (behind.code !== 0) {
    throw new Error('Failed to compare branches.');
  }

  if (behind.stdout.trim() !== '0') {
    throw new errors.LocalMasterBehindRemote();
  }
};

module.exports = checkIfLocalMasterIsBehindRemote;

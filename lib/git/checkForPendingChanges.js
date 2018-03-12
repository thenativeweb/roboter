'use strict';

const errors = require('../errors'),
      execLive = require('../shell/execLive');

const checkForPendingChanges = async function ({ directory }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }

  const behind = await execLive('git status -s', { cwd: directory, silent: true });

  if (behind.code !== 0) {
    throw new Error('Failed to check for pending changes.');
  }

  if (behind.stdout.trim() !== '') {
    throw new errors.PendingChanges();
  }
};

module.exports = checkForPendingChanges;

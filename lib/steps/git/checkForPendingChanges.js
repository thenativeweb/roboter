'use strict';

const errors = require('../../errors'),
      runCommand = require('../../runCommand');

const checkForPendingChanges = async function ({ directory }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }

  let behind;

  try {
    behind = await runCommand('git status -s', { cwd: directory, silent: true });
  } catch {
    throw new Error('Failed to check for pending changes.');
  }

  if (behind.stdout.trim() !== '') {
    throw new errors.PendingChanges();
  }
};

module.exports = checkForPendingChanges;

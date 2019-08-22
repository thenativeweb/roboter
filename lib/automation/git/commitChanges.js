'use strict';

const execLive = require('../../shell/execLive');

const commitChanges = async function ({ directory, message, ui }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }
  if (!message) {
    throw new Error('Message is missing.');
  }
  if (!ui) {
    throw new Error('UI is missing.');
  }

  ui.printTaskHeader('commit');

  const add = await execLive('git add .', { cwd: directory, silent: true });

  if (add.exitCode !== 0) {
    throw new Error('Failed to add changes.');
  }

  const commit = await execLive('git', { args: [ 'commit', `-m ${message}` ], cwd: directory, silent: true });

  if (commit.exitCode !== 0) {
    throw new Error('Failed to commit changes.');
  }
};

module.exports = commitChanges;

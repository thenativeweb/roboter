'use strict';

const execLive = require('../shell/execLive');

const commitChanges = async function ({ directory, message }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }
  if (!message) {
    throw new Error('Message is missing.');
  }

  const add = await execLive('git add .', { cwd: directory, silent: true });

  if (add.code !== 0) {
    throw new Error('Failed to add changes.');
  }

  const commit = await execLive('git', { args: [ 'commit', `-m ${message}` ], cwd: directory, silent: true });

  if (commit.code !== 0) {
    throw new Error('Failed to commit changes.');
  }
};

module.exports = commitChanges;

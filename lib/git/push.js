'use strict';

const execLive = require('../shell/execLive');

const push = async function ({ directory, remote, branch, pushTags = false }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }
  if (!remote) {
    throw new Error('Remote is missing.');
  }
  if (!branch) {
    throw new Error('Branch is missing.');
  }

  const commit = await execLive('git', {
    args: [ 'push', remote, branch, pushTags ? '--tags' : '' ],
    cwd: directory,
    silent: true
  });

  if (commit.code !== 0) {
    throw new Error('Failed to commit changes.');
  }
};

module.exports = push;

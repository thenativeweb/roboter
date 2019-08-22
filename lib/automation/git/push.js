'use strict';

const execLive = require('../../shell/execLive');

const push = async function ({ directory, remote, branch, pushTags = false, ui }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }
  if (!remote) {
    throw new Error('Remote is missing.');
  }
  if (!branch) {
    throw new Error('Branch is missing.');
  }
  if (!ui) {
    throw new Error('UI is missing.');
  }

  ui.printTaskHeader('git push');

  const commit = await execLive('git', {
    args: [ 'push', remote, branch, pushTags ? '--tags' : '' ],
    cwd: directory,
    silent: true
  });

  if (commit.exitCode !== 0) {
    throw new Error('Failed to push to remote repository.');
  }
};

module.exports = push;

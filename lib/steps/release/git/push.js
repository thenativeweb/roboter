'use strict';

const runCommand = require('../../../runCommand'),
      shellEscape = require('../../../shellEscape');

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

  try {
    await runCommand(shellEscape`git push '${remote}' '${branch}' ${pushTags ? '--tags' : ''}`, {
      cwd: directory,
      silent: true
    });
  } catch {
    throw new Error('Failed to push to remote repository.');
  }
};

module.exports = push;

'use strict';

const errors = require('../../errors'),
      runCommand = require('../../runCommand');

const getCurrentBranch = async function ({ directory }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }

  let branch;

  try {
    const branchResult = await runCommand('git branch --contains HEAD', { cwd: directory, silent: true });

    branch = branchResult.stdout.trim();
  } catch {
    throw new errors.GitFailed('Failed to get current branch.');
  }

  branch = branch.replace(/\* /u, '');

  return branch;
};

module.exports = getCurrentBranch;

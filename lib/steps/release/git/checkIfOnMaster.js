'use strict';

const errors = require('../../errors'),
      runCommand = require('../../runCommand');

const checkIfOnMaster = async function ({ directory, ui }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }
  if (!ui) {
    throw new Error('UI is missing.');
  }

  ui.printTaskHeader('check for master branch');

  let branch;

  try {
    branch = await runCommand('git rev-parse --abbrev-ref HEAD', { cwd: directory, silent: true });
  } catch {
    throw new Error('Failed to check for master branch.');
  }

  if (branch.stdout.trim() !== 'master') {
    throw new errors.NotOnLocalMaster();
  }
};

module.exports = checkIfOnMaster;

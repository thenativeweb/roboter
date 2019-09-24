'use strict';

const runCommand = require('../../runCommand'),
      shellEscape = require('../../shellEscape');

const commitChanges = async function ({ directory, message }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }
  if (!message) {
    throw new Error('Message is missing.');
  }

  try {
    await runCommand('git add .', { cwd: directory, silent: true });
  } catch {
    throw new Error('Failed to add changes.');
  }

  try {
    await runCommand(shellEscape`git commit -m '${message}'`, { cwd: directory, silent: true });
  } catch {
    throw new Error('Failed to commit changes.');
  }
};

module.exports = commitChanges;

'use strict';

const runCommand = require('../../../runCommand'),
      shellEscape = require('../../../shellEscape');

const tag = async function ({ message, name, directory, ui }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }
  if (!name) {
    throw new Error('Name is missing.');
  }
  if (!ui) {
    throw new Error('UI is missing.');
  }

  ui.printTaskHeader('git tag');

  try {
    await runCommand(shellEscape`git tag -am '${message}' '${name}'`, { cwd: directory, silent: true });
  } catch {
    throw new Error('Failed to add tag.');
  }
};

module.exports = tag;

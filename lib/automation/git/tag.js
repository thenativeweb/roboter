'use strict';

const execLive = require('../../shell/execLive');

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

  const createTag = await execLive('git', { args: [ 'tag', `-a`, `-m "${message}"`, name ], cwd: directory, silent: true });

  if (createTag.code !== 0) {
    throw new Error('Failed to add tag.');
  }
};

module.exports = tag;

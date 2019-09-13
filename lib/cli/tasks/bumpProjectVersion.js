'use strict';

const bumpVersionStep = require('../../steps/release/bumpVersion');

const bumpVersion = async function ({ path, type, ui }) {
  if (!path) {
    throw new Error('Path is missing.');
  }
  if (!type) {
    throw new Error('Type is missing.');
  }
  if (!ui) {
    throw new Error('UI is missing.');
  }

  try {
    ui.printTaskHeader('version bump');

    return await bumpVersionStep({ path, type });
  } catch (ex) {
    ui.printTaskFailure('Failed to bump project version.');
    throw ex;
  }
};

module.exports = bumpVersion;

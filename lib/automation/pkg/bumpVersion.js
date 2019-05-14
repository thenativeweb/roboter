'use strict';

const { promisify } = require('util');

const bumpCallback = require('bump-regex');

const file = require('../../file');

const bump = promisify(bumpCallback);

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

  ui.printTaskHeader('version bump');

  try {
    const packageJson = await file.read(path);

    const bumpResult = await bump({
      str: packageJson,
      type
    });

    await file.write(path, bumpResult.str);

    return {
      new: bumpResult.new,
      prev: bumpResult.prev
    };
  } catch (ex) {
    throw new Error('Failed to bump package version.');
  }
};

module.exports = bumpVersion;

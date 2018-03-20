'use strict';

const bumpCallback = require('bump-regex'),
      promisify = require('util.promisify');

const file = require('../file');

const bump = promisify(bumpCallback);

const bumpVersion = async function ({ path, type }) {
  if (!path) {
    throw new Error('Path is missing.');
  }
  if (!type) {
    throw new Error('Type is missing.');
  }

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

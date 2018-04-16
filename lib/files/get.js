'use strict';

const flatten = require('lodash/flatten'),
      glob = require('globby');

const get = async function ({ directory, pattern }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }
  if (!pattern) {
    throw new Error('Pattern is missing.');
  }

  const patterns = flatten([ pattern ]);

  const files = await glob(patterns, {
    cwd: directory,
    nodir: true,
    nonull: true
  });

  return files;
};

module.exports = get;

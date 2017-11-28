'use strict';

const buntstift = require('buntstift'),
      flatten = require('lodash/flatten'),
      glob = require('globby');

const get = async function ({ directory, pattern }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }
  if (!pattern) {
    throw new Error('Pattern is missing.');
  }

  const stopWaiting = buntstift.wait();

  const patterns = flatten([ pattern ]);

  const files = await glob(patterns, {
    cwd: directory,
    nodir: true,
    nonull: true
  });

  stopWaiting();

  return files;
};

module.exports = get;

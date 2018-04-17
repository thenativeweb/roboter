'use strict';

const promisify = require('util.promisify'),
      rimrafCallback = require('rimraf');

const rimraf = promisify(rimrafCallback);

const removeRecursively = async function (path) {
  if (!path) {
    throw new Error('Path is missing.');
  }

  await rimraf(path);
};

module.exports = removeRecursively;

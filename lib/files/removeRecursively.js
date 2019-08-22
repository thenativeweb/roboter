'use strict';

const shell = require('shelljs');

const removeRecursively = async function (path) {
  if (!path) {
    throw new Error('Path is missing.');
  }

  shell.rm('-rf', path);
};

module.exports = removeRecursively;

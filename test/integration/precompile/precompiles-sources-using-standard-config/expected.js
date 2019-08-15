'use strict';

const path = require('path');

const assert = require('assertthat'),
      shell = require('shelljs');

const exitCode = 0;

const stdout = '';

const stderr = '';

const validate = async function (options) {
  const { dirname } = options;

  const precompiledFile = shell.cat(path.join(dirname, 'build', 'index.js'));

  assert.that(precompiledFile.stdout).is.containing('function (left, right) {');
};

module.exports = { exitCode, stdout, stderr, validate };

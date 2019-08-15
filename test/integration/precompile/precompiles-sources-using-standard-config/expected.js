'use strict';

const path = require('path');

const assert = require('assertthat'),
      shell = require('shelljs');

const exitCode = 0;

const stdout = '';

const stderr = '';

const validate = async function ({ directory }) {
  const precompiledFile = shell.cat(path.join(directory, 'build', 'index.js'));

  assert.that(precompiledFile.stdout).is.containing('function (left, right) {');
};

module.exports = { exitCode, stdout, stderr, validate };

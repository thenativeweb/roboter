'use strict';

const fs = require('fs'),
      path = require('path');

const { assert } = require('assertthat');

const exitCode = 0;

const stdout = '';

const stderr = '';

const validate = async function ({ directory }) {
  const builtFile = await fs.promises.readFile(path.join(directory, 'build', 'index.js'), { encoding: 'utf8' });

  assert.that(builtFile).is.containing('function (left, right) {');
};

module.exports = { exitCode, stdout, stderr, validate };

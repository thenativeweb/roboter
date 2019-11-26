'use strict';

const path = require('path');

const { assert } = require('assertthat');

const exitCode = 0;

const stdout = '';

const stderr = '';

const validate = async function ({ directory }) {
  /* eslint-disable global-require */
  const packageJson = require(path.join(directory, 'package.json'));
  /* eslint-enable global-require */

  assert.that(packageJson.version).is.equalTo('1.0.0');
};

module.exports = { exitCode, stdout, stderr, validate };

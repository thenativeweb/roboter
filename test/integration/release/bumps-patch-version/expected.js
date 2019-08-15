'use strict';

const path = require('path');

const assert = require('assertthat');

const exitCode = 0;

const stdout = '';

const stderr = '';

const validate = async function ({ directory }) {
  /* eslint-disable global-require */
  const packgeJson = require(path.join(directory, 'package.json'));
  /* eslint-enable global-require */

  assert.that(packgeJson.version).is.equalTo('0.0.2');
};

module.exports = { exitCode, stdout, stderr, validate };

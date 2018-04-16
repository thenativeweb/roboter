'use strict';

const path = require('path');

const assert = require('assertthat');

const exitCode = 0;

const stdout = '';

const stderr = '';

const validate = async function (options) {
  const { dirname } = options;

  /* eslint-disable global-require */
  const packgeJson = require(path.join(dirname, 'package.json'));
  /* eslint-enable global-require */

  assert.that(packgeJson.version).is.equalTo('1.0.0');
};

module.exports = { exitCode, stdout, stderr, validate };

'use strict';

const assert = require('assertthat');

const exitCode = 1;

const stdout = 'AssertionError [ERR_ASSERTION]: Expected true to be false.';

const stderr = '';

const validate = async function (options) {
  assert.that(options.stdout).is.not.containing('Running e2e tests');
};

module.exports = { exitCode, stdout, stderr, validate };

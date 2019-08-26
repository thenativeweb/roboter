'use strict';

const assert = require('assertthat').default;

const exitCode = 1;

const stdout = '';

const stderr = '';

const validate = async function (options) {
  assert.that(options.stdout).is.not.containing('Running e2e tests');
};

module.exports = { exitCode, stdout, stderr, validate };

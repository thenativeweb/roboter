'use strict';

const assert = require('assertthat').default;

const exitCode = 0;

const stdoutTest = 'unit tests successful.';

const stderr = '';

const validate = async function ({
  stdout
}) {
  assert.that(stdout).is.not.containing('javascript');
  assert.that(stdout).is.containing('typescript');
};

module.exports = { exitCode, stdout: stdoutTest, stderr, validate };

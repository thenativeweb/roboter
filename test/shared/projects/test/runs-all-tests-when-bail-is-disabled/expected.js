'use strict';

const subCommand = 'test --no-bail';

const exitCode = 1;

const stdout = [
  'Running unit tests...',
  'AssertionError [ERR_ASSERTION]: Expected true to be false.',
  'Running e2e tests...'
];

const stderr = '';

module.exports = { exitCode, stdout, stderr, subCommand };

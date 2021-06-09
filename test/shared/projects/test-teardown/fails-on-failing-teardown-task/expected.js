'use strict';

const subCommand = 'test teardown'

const exitCode = 1;

const stdout = '';

const stderr = [
  'Error: Teardown failed.',
  '✗ Failed to run test teardown.'
];

module.exports = { subCommand, exitCode, stdout, stderr };

'use strict';

const exitCode = 0;

const stdout = [
  'Hello from global pre task!',
  'Hello from unit test!',
  'unit tests successful.',
  'Hello from integration test!',
  'integration tests successful.',
  'Hello from global post task!'
];

const stderr = '';

module.exports = { exitCode, stdout, stderr };

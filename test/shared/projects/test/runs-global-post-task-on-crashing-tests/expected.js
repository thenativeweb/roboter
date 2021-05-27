'use strict';

const exitCode = 1;

const stdout = [
  `Hello from global pre task!`,
  `Hello from global post task!`
];

const stderr = '✗ Tests failed.';

module.exports = { exitCode, stdout, stderr };

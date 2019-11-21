'use strict';

const exitCode = 1;

const stdout = [
  `Hello from pre task!`,
  `Hello from post task!`
];

const stderr = '✗ Tests failed.';

module.exports = { exitCode, stdout, stderr };

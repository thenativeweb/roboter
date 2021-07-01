'use strict';

const exitCode = 0;

const stdout = [
  `Running outdated dependencies check`,
  `Package  Current  Wanted    Latest  Location            Depended by
noop3     13.7.2  13.7.2`
];

const stderr = '';

module.exports = { exitCode, stdout, stderr };

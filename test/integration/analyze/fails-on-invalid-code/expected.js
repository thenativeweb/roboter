'use strict';

const exitCode = 1;

const stdout = `
  3:7  error  'x' is defined but never used  no-unused-vars

✖ 1 problem (1 error, 0 warnings)
`;

const stderr = '';

module.exports = { exitCode, stdout, stderr };

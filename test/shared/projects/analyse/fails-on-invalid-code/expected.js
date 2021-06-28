'use strict';

const exitCode = 1;

const stdout = `
  3:7  error  'x' is assigned a value but never used  no-unused-vars

✖ 1 problem (1 error, 0 warnings)
`;

const stderr = 'Malformed code found.';

module.exports = { exitCode, stdout, stderr };

'use strict';

const exitCode = 1;

const stdout = '';

const stderr = `✗ Release type 'nonsense' is not supported. Choose one of 'patch', 'minor' or 'major'.
✗ Failed to release.`;

module.exports = { exitCode, stdout, stderr };

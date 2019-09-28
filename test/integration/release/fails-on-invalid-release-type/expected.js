'use strict';

const exitCode = 1;

const stdout = '';

const stderr = `✗ Invalid release type 'nonsense'. Use 'patch', 'minor' or 'major'.
✗ Failed to release.`;

module.exports = { exitCode, stdout, stderr };

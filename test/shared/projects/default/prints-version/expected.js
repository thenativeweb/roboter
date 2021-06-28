'use strict';

const packageJson = require('../../../../../package.json');

const exitCode = 0;

const stdout = packageJson.version;

const stderr = '';

module.exports = { exitCode, stdout, stderr };

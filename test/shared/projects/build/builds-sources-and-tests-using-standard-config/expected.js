'use strict';

const fs = require('fs').promises,
      path = require('path');

const exitCode = 0;

const stdout = '';

const stderr = '';

const validate = async function ({ directory }) {
  await fs.stat(path.join(directory, 'build', 'src', 'index.js'));
  await fs.stat(path.join(directory, 'build', 'test', 'unit', 'indexTest.js'));
};

module.exports = { exitCode, stdout, stderr, validate };

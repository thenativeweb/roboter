'use strict';

const path = require('path');

const shell = require('../shell');

const precompile = async function ({ directory, distributionPath, sourcePath }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }
  if (!distributionPath) {
    throw new Error('Distribution path is missing.');
  }
  if (!sourcePath) {
    throw new Error('Source path is missing.');
  }

  const babel = await shell.execLive(path.join(__dirname, '..', '..', 'node_modules', '.bin', 'babel'), {
    args: [ sourcePath, '--out-dir', distributionPath, '--copy-files', '--presets=env,react', '--plugins', 'transform-runtime' ],
    cwd: directory,
    silent: false
  });

  if (babel.code !== 0) {
    throw new Error('Failed to precompile package.');
  }
};

module.exports = precompile;

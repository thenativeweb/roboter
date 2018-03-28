'use strict';

const path = require('path');

const shell = require('../../shell');

const files = require('../../files');

const precompile = async function ({ directory, distributionPath, sourcePath, ui }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }
  if (!distributionPath) {
    throw new Error('Distribution path is missing.');
  }
  if (!sourcePath) {
    throw new Error('Source path is missing.');
  }
  if (!ui) {
    throw new Error('UI is missing.');
  }

  ui.printTaskHeader('precompilation');

  let babelOptions = [];

  const hasBabelRc = await files.exists({ path: path.join(directory, '.babelrc') });

  if (!hasBabelRc) {
    babelOptions = [ '--presets=env,react', '--plugins', 'transform-runtime' ];
  }

  const babel = await shell.execLive('npx', {
    args: [ 'babel', sourcePath, '--out-dir', distributionPath, '--copy-files', ...babelOptions ],
    cwd: directory,
    silent: false
  });

  if (babel.code !== 0) {
    throw new Error('Failed to precompile package.');
  }
};

module.exports = precompile;

'use strict';

const path = require('path');

const files = require('../../files'),
      shell = require('../../shell');

const precompile = async function ({ directory, ui }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }
  if (!ui) {
    throw new Error('UI is missing.');
  }

  ui.printTaskHeader('precompilation');

  const tsconfigPath = path.join(directory, 'tsconfig.json');

  /* eslint-disable global-require */
  const tsconfig = require(tsconfigPath);
  /* eslint-enable global-require */

  if (!tsconfig.compilerOptions || !tsconfig.compilerOptions.outDir) {
    ui.warn('Skipping precompile because no output directory is configured.');

    return;
  }

  await files.removeRecursively(tsconfig.compilerOptions.outDir);

  const tsc = await shell.execLive('npx', {
    args: [ 'tsc' ],
    cwd: directory,
    silent: false
  });

  if (tsc.exitCode !== 0) {
    throw new Error('Failed to precompile package.');
  }
};

module.exports = precompile;

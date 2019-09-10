'use strict';

const fs = require('fs').promises,
      path = require('path');

const runCommand = require('../../runCommand');

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

  await fs.rmdir(tsconfig.compilerOptions.outDir, { recursive: true });

  try {
    await runCommand('npx tsc', { cwd: directory });
  } catch {
    throw new Error('Failed to precompile package.');
  }
};

module.exports = precompile;

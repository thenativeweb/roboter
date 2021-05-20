'use strict';

const fs = require('fs').promises,
      path = require('path');

const errors = require('../../errors'),
      packageJson = require('../../../package.json'),
      runCommand = require('../../runCommand');

const compileTypeScript = async function ({ directory }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }

  const tsconfigPath = path.join(directory, 'tsconfig.json');

  /* eslint-disable global-require */
  const tsconfig = require(tsconfigPath);
  /* eslint-enable global-require */

  if (!tsconfig.compilerOptions || !tsconfig.compilerOptions.outDir) {
    throw new errors.TypeScriptOutputConfigurationMissing();
  }

  await fs.rmdir(tsconfig.compilerOptions.outDir, { recursive: true });

  try {
    await runCommand(`npx --package typescript@${packageJson.dependencies.typescript} tsc`, { cwd: directory });
  } catch {
    throw new errors.TypeScriptCompilationFailed();
  }
};

module.exports = compileTypeScript;

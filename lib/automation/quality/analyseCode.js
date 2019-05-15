'use strict';

const path = require('path');

const errors = require('../../errors'),
      files = require('../../files'),
      shell = require('../../shell');

const analyseCode = async function ({ directory, printSuccess, ui }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }
  if (!ui) {
    throw new Error('UI is missing.');
  }

  ui.printTaskHeader('code analysis');

  const sourceFiles = await analyseCode.getFiles({ directory });

  if (sourceFiles.length === 0) {
    ui.printTaskOmission('No code found, skipping code analysis.');

    return;
  }

  const pathToEslintRc = path.join(directory, '.eslintrc.json');
  const doesEslintRcExist = await files.exists({ path: pathToEslintRc });

  try {
    await shell.execLive('npx', {
      args: [
        'eslint',
        '--color',

        // Suppress warnings that might get caused by a local .eslintignore file
        '--quiet',

        ...doesEslintRcExist ? [] : [ '--config', 'es/node' ],
        ...sourceFiles
      ],
      cwd: directory
    });
  } catch {
    throw new errors.CodeMalformed();
  }

  if (printSuccess) {
    ui.printTaskSuccess({ name: 'Code analysis' });
  }
};

analyseCode.getFiles = async function ({ directory }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }

  const sourceFiles = await files.get({
    directory,
    pattern: [
      '**/*.js',
      '**/*.jsx',
      '!**/node_modules/**/*',
      '!build/**/*',
      '!coverage/**/*',
      '!dist/**/*'
    ]
  });

  return sourceFiles;
};

module.exports = analyseCode;

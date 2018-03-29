'use strict';

const path = require('path');

const eslint = require('eslint'),
      eslintConfiguration = require('eslint-config-es/2015/server');

const errors = require('../../errors'),
      files = require('../../files');

const analyseCode = async function ({ directory, printSuccess, ui }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }
  if (!ui) {
    throw new Error('UI is missing.');
  }

  ui.printTaskHeader('code analysis');

  const sourceFiles = await analyseCode.getFiles({ directory });
  const doesEslintRcExist = await files.exists({ path: path.join(directory, '.eslintrc.json') });

  const engineConfiguration =
    doesEslintRcExist ?
      {
        cwd: directory,
        useEslintrc: true
      } :
      {
        cwd: directory,
        parserOptions: eslintConfiguration.parserOptions,
        envs: Object.keys(eslintConfiguration.env),
        globals: Object.keys(eslintConfiguration.globals),
        plugins: eslintConfiguration.plugins,
        rules: eslintConfiguration.rules,
        useEslintrc: false
      };

  const cliEngine = new eslint.CLIEngine(engineConfiguration);

  const report = cliEngine.executeOnFiles(sourceFiles);

  if (report.errorCount > 0) {
    const formatter = cliEngine.getFormatter();

    ui.info(formatter(report.results));

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
      '!node_modules/**/*',
      '!coverage/**/*',
      '!dist/**/*'
    ]
  });

  return sourceFiles;
};

module.exports = analyseCode;

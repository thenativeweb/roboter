'use strict';

const path = require('path');

const buntstift = require('buntstift'),
      eslint = require('eslint'),
      eslintConfiguration = require('eslint-config-es/2015/server');

const errors = require('../../errors'),
      files = require('../../files');

const analyseCode = async function ({ directory, printSuccess }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }

  const sourceFiles = await analyseCode.getFiles({ directory });

  buntstift.line();
  buntstift.info('Running code analysis...', { prefix: '▸' });

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

    buntstift.info(formatter(report.results));

    throw new errors.CodeMalformed();
  }

  if (printSuccess) {
    buntstift.line();
    buntstift.success('Code analysis successful.');
  }
};

analyseCode.getFiles = async function ({ directory }) {
  const sourceFiles = await files.get({
    directory,
    pattern: [
      '**/*.js',
      '**/*.jsx',
      '!node_modules/**/*.js',
      '!coverage/**/*.js',
      '!dist/**/*.js'
    ]
  });

  return sourceFiles;
};

module.exports = analyseCode;

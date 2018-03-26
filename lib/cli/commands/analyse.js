'use strict';

const path = require('path');

const buntstift = require('buntstift'),
      eslint = require('eslint'),
      eslintConfiguration = require('eslint-config-es/2015/server'),
      fileExists = require('file-exists'),
      getUsage = require('command-line-usage'),
      promisify = require('util.promisify');

const errors = require('../../errors'),
      files = require('../../files'),
      globalOptionDefinitions = require('../globalOptionDefinitions'),
      watchFilesAndExecute = require('../../watchFilesAndExecute');

const exists = promisify(fileExists);

const analyse = {
  description: 'Run code analysis.',

  async getOptionDefinitions () {
    return [
      {
        name: 'watch',
        alias: 'w',
        type: Boolean,
        defaultValue: false,
        description: 'watch files'
      }
    ];
  },

  async run (options) {
    if (!options) {
      throw new Error('Options are missing.');
    }
    if (options.watch === undefined) {
      throw new Error('Watch is missing.');
    }

    const directory = process.cwd(),
          { help, watch } = options;

    if (help) {
      return buntstift.info(getUsage([
        { header: 'roboter analyse', content: this.description },
        { header: 'Synopsis', content: 'roboter analyse' },
        { header: 'Options', optionList: [ ...await this.getOptionDefinitions(), ...globalOptionDefinitions ]}
      ]));
    }

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

    if (watch) {
      await watchFilesAndExecute({
        message: 'Running code analysis in watch mode...',
        files: sourceFiles,
        execute: async () => await analyse.run({ help: false, watch: false })
      });
    }

    buntstift.line();
    buntstift.info('Running code analysis...', { prefix: '▸' });

    const stopWaiting = buntstift.wait();

    try {
      const engineConfiguration =
        exists(path.join(directory, '.eslintrc.json')) ?
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

      stopWaiting();
      buntstift.success('Code analysis successful.');
    } catch (ex) {
      stopWaiting();

      switch (ex.code) {
        case 'ECODEMALFORMED':
          buntstift.error('Code analysis failed.');
          break;
        default:
          buntstift.error('Failed to run code analysis.');
      }

      throw ex;
    }
  }
};

module.exports = analyse;

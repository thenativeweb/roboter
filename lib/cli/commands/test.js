'use strict';

const path = require('path');

const buntstift = require('buntstift'),
      getUsage = require('command-line-usage'),
      oneLine = require('common-tags/lib/oneLine');

const analyse = require('./analyse'),
      errors = require('../../errors'),
      execLive = require('../../shell/execLive'),
      files = require('../../files'),
      globalOptionDefinitions = require('../globalOptionDefinitions'),
      watchFilesAndExecute = require('../../watchFilesAndExecute');

const mochaExecutable = path.join(__dirname, '..', '..', '..', 'node_modules', '.bin', 'mocha');

const test = {
  description: 'Run tests.',

  async getOptionDefinitions () {
    return [
      {
        name: 'type',
        alias: 't',
        type: String,
        defaultValue: '',
        description: 'run only tests of given type'
      },
      {
        name: 'skip-analyse',
        alias: 'a',
        type: Boolean,
        defaultValue: false,
        description: 'skip code analysis'
      },
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
    if (options.type === undefined) {
      throw new Error('Type is missing.');
    }
    if (options['skip-analyse'] === undefined) {
      throw new Error('Skip analyse is missing.');
    }
    if (options.watch === undefined) {
      throw new Error('Watch is missing.');
    }

    const directory = process.cwd(),
          { help, type, watch } = options;

    const skipAnalyse = options['skip-analyse'];

    if (help) {
      return buntstift.info(getUsage([
        { header: 'roboter test', content: this.description },
        { header: 'Synopsis', content: 'roboter test' },
        { header: 'Options', optionList: [ ...await this.getOptionDefinitions(), ...globalOptionDefinitions ]}
      ]));
    }

    const sourceFiles = await files.get({
      directory,
      pattern: [
        '**/*.js',
        '!node_modules/**/*.js',
        '!coverage/**/*.js',
        '!dist/**/*.js'
      ]
    });

    if (watch) {
      await watchFilesAndExecute({
        message: 'Running tests in watch mode...',
        files: sourceFiles,
        execute: async () => await test.run({ help: false, type, watch: false })
      });
    }

    try {
      if (!skipAnalyse) {
        await analyse.run({ help: false, watch: false });
      }

      buntstift.info('Running tests...');

      const testFiles = await files.get({
        directory,
        pattern: `test/${type}/**/*Tests.js`
      });

      if (!testFiles || testFiles.length === 0) {
        throw new errors.TestsMissing();
      }

      let result;

      try {
        result = await execLive(oneLine`
          ${mochaExecutable}
            --async-only
            --bail
            --colors
            --reporter spec
            --ui tdd
            ${testFiles.join(' ')}
        `);
      } catch (ex) {
        if (ex.stdout) {
          buntstift.info(ex.stdout);
        }

        throw new errors.TestsFailed();
      }

      buntstift.info(result.stdout);

      buntstift.success('Tests successful.');
    } catch (ex) {
      switch (ex.code) {
        case 'ETESTSMISSING':
          return buntstift.warn('No tests found.');
        case 'ETESTSFAILED':
          buntstift.error('Tests failed.');
          break;
        default:
          buntstift.error('Failed to run tests.');
      }

      throw ex;
    }
  }
};

module.exports = test;

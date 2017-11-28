'use strict';

const path = require('path');

const buntstift = require('buntstift'),
      getUsage = require('command-line-usage'),
      glob = require('glob'),
      oneLine = require('common-tags/lib/oneLine'),
      promisify = require('util.promisify');

const analyse = require('./analyse'),
      errors = require('../../errors'),
      exec = require('../../shell/exec'),
      globalOptionDefinitions = require('../globalOptionDefinitions'),
      watchFilesAndExecute = require('../../watchFilesAndExecute');

const globAsync = promisify(glob);

const mochaExecutable = path.join(__dirname, '..', '..', '..', 'node_modules', '.bin', 'mocha');

const test = {
  description: 'Run tests.',

  async getOptionDefinitions () {
    return [
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
    if (options['skip-analyse'] === undefined) {
      throw new Error('Skip analyse is missing.');
    }
    if (options.watch === undefined) {
      throw new Error('Watch is missing.');
    }

    const directory = process.cwd(),
          { help, watch } = options;

    const skipAnalyse = options['skip-analyse'];

    if (help) {
      return buntstift.info(getUsage([
        { header: 'roboter test', content: this.description },
        { header: 'Synopsis', content: 'roboter test' },
        { header: 'Options', optionList: [ ...await this.getOptionDefinitions(), ...globalOptionDefinitions ]}
      ]));
    }

    const sourceFiles = [
      '**/*.js',
      '!**/node_modules/**/*.js',
      '!coverage/**/*.js',
      '!dist/**/*.js'
    ];

    const testFilesGlob = 'test/units/**/*Tests.js';

    if (watch) {
      await watchFilesAndExecute({
        message: 'Running tests in watch mode...',
        files: sourceFiles,
        execute: async () => await test.run({ help: false, watch: false })
      });
    }

    try {
      if (!skipAnalyse) {
        await analyse.run({ help: false, watch: false });
      }

      buntstift.info('Running tests...');

      const testFiles = await globAsync(testFilesGlob, {
        cwd: directory,
        nodir: true,
        nonull: false
      });

      if (!testFiles || testFiles.length === 0) {
        throw new errors.TestsMissing();
      }

      try {
        await exec(oneLine`
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

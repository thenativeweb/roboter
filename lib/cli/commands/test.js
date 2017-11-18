'use strict';

const buntstift = require('buntstift'),
      chokidar = require('chokidar'),
      getUsage = require('command-line-usage'),
      glob = require('glob'),
      Mocha = require('mocha');

const errors = require('../../errors'),
      globalOptionDefinitions = require('../globalOptionDefinitions'),
      noop = require('../../noop');

const test = {
  description: 'Run tests.',

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
        { header: 'roboter test', content: this.description },
        { header: 'Synopsis', content: 'roboter test' },
        { header: 'Options', optionList: [ ...await this.getOptionDefinitions(), ...globalOptionDefinitions ]}
      ]));
    }

    const testSources = './test/units/**/*Tests.js';

    if (watch) {
      buntstift.info('Running tests in watch mode...');

      chokidar.watch(testSources, { ignoreInitial: true }).
        on('all', () => {
          (async () => {
            buntstift.line();
            try {
              await test.run({ help: false, watch: false });
            } catch (ex) {
              // In watch mode, we ignore any errors (since we do not have an
              // exit code anyway).
            }
          })();
        });

      await new Promise(noop);
    }

    buntstift.info('Running tests...');

    const stopWaiting = buntstift.wait();

    try {
      const testFiles = await new Promise((resolve, reject) => {
        glob(testSources, {
          cwd: directory,
          nodir: true,
          nonull: false
        }, (err, files) => {
          if (err) {
            reject(err);
          }

          resolve(files);
        });
      });

      if (!testFiles) {
        return buntstift.error('Sorry, could not locate any tests!');
      }

      const mocha = new Mocha({
        asyncOnly: true,
        bail: true,
        colors: true,
        reporter: 'spec',
        ui: 'tdd'
      });

      testFiles.forEach(file => {
        mocha.addFile(file);
      });

      const failures = await new Promise(resolve => {
        mocha.run(resolve);
      });

      if (failures) {
        throw new errors.TestsFailed();
      }

      buntstift.success('All tests succeeded! Life is good.');
    } catch (ex) {
      stopWaiting();

      switch (ex.code) {
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

'use strict';

const path = require('path');

const buntstift = require('buntstift'),
      flatten = require('lodash/flatten'),
      getUsage = require('command-line-usage'),
      oneLine = require('common-tags/lib/oneLine');

const analyse = require('./analyse'),
      errors = require('../../errors'),
      execLive = require('../../shell/execLive'),
      files = require('../../files'),
      globalOptionDefinitions = require('../globalOptionDefinitions'),
      watchFilesAndExecute = require('../../watchFilesAndExecute');

const paths = {
  mochaExecutable: path.join(__dirname, '..', '..', '..', 'node_modules', '.bin', 'mocha'),
  testDirectory: path.join(process.cwd(), 'test')
};

const runLifecycleTask = async function ({ directory, step }) {
  if (!directory) {
    throw new Error('Directory is misssing.');
  }
  if (!step) {
    throw new Error('Step is misssing.');
  }

  const file = path.join(directory, `${step}.js`);

  if (!await files.exists({ file })) {
    return;
  }

  buntstift.line();
  buntstift.info(`Running ${step} task ...`, { prefix: '▸' });

  /* eslint-disable global-require */
  const stepFunction = require(file);
  /* eslint-enable global-require */

  await stepFunction();
};

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
        execute: async () => await test.run({ help: false, type, watch: false, 'skip-analyse': skipAnalyse })
      });
    }

    try {
      const types = flatten([ type || await files.getSubDirectories({ directory: paths.testDirectory }) ]);

      if (!skipAnalyse) {
        await analyse.run({ help: false, watch: false });
      }

      const preferredTypes = [ 'units', 'integration', 'e2e' ];

      preferredTypes.reverse().forEach(preferredType => {
        const index = types.indexOf(preferredType);

        if (index !== -1) {
          types.splice(index, 1);
          types.unshift(preferredType);
        }
      });

      for (let i = 0; i < types.length; i++) {
        const currentType = types[i];

        buntstift.line();
        buntstift.info(`Running tests of type ${currentType}...`, { prefix: '▸' });

        const testFiles = await files.get({
          directory,
          pattern: `test/${currentType}/**/*Tests.js`
        });

        if (!testFiles || testFiles.length === 0) {
          throw new errors.TestsMissing();
        }

        await runLifecycleTask({ directory: path.join(paths.testDirectory, currentType), step: 'pre' });

        try {
          await execLive(oneLine`
            ${paths.mochaExecutable}
              --async-only
              --bail
              --colors
              --exit
              --reporter spec
              --ui tdd
              ${testFiles.join(' ')}
          `, {
            maxBuffer: 1000 * 1000 * 100
          });
        } catch (ex) {
          throw new errors.TestsFailed();
        } finally {
          await runLifecycleTask({ directory: path.join(paths.testDirectory, currentType), step: 'post' });
        }

        buntstift.success(`Tests of type ${currentType} successful.`);
      }
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

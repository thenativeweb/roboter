'use strict';

const globalOptionDefinitions = require('../globalOptionDefinitions'),
      quality = require('../../automation/quality'),
      ui = require('../ui'),
      watchFilesAndExecute = require('../../watchFilesAndExecute');

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
    if (options.watch === undefined) {
      throw new Error('Watch is missing.');
    }

    const directory = process.cwd(),
          { help, type, watch } = options;

    if (help) {
      return ui.printUsage([
        { header: 'roboter test', content: this.description },
        { header: 'Synopsis', content: 'roboter test [--type <type>] [--watch]' },
        { header: 'Options', optionList: [ ...await this.getOptionDefinitions(), ...globalOptionDefinitions ]}
      ]);
    }

    if (watch) {
      await watchFilesAndExecute({
        message: 'Running tests in watch mode...',
        files: await quality.testCode.getFiles({ directory }),
        execute: async () => await quality.testCode({ directory, type, printSuccess: true, ui }),
        executeOnStart: true
      });
    }

    try {
      await quality.testCode({ directory, type, ui });

      ui.printTaskSuccess('Tests successful.');
    } catch (ex) {
      switch (ex.code) {
        case 'ETESTSMISSING':
          ui.warn('No tests found.');

          return;
        case 'ETESTSFAILED':
          ui.printTaskFailure('Tests failed.');
          break;
        default:
          ui.error('Failed to run tests.');
      }

      throw ex;
    }
  }
};

module.exports = test;

'use strict';

const globalOptionDefinitions = require('../globalOptionDefinitions'),
      testCodeTask = require('../tasks/testCode'),
      ui = require('../ui'),
      watchFilesAndExecute = require('../../watchFilesAndExecute');

const testCommand = {
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
        files: await testCodeTask.getFiles({ directory }),
        execute: async () => await this.runTasks({ directory, type }),
        executeOnStart: true
      });
    }

    await this.runTasks({ directory, type });
  },

  async runTasks ({ directory, type }) {
    if (!directory) {
      throw new Error('Directory is missing.');
    }

    await testCodeTask({ directory, type, ui });
  }
};

module.exports = testCommand;

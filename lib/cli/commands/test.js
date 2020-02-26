'use strict';

const globalOptionDefinitions = require('../globalOptionDefinitions'),
      runPreOrPostTask = require('../tasks/runPreOrPostTask'),
      testCodeTask = require('../tasks/testCode'),
      ui = require('../ui');

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

    const directory = process.cwd(),
          { help, type } = options;

    if (help) {
      return ui.printUsage([
        { header: 'roboter test', content: this.description },
        { header: 'Synopsis', content: 'roboter test [--type <type>]' },
        { header: 'Options', optionList: [ ...await this.getOptionDefinitions(), ...globalOptionDefinitions ]}
      ]);
    }

    await this.runTasks({ directory, type });
  },

  async runTasks ({ directory, type }) {
    if (!directory) {
      throw new Error('Directory is missing.');
    }

    await runPreOrPostTask({ directory, ui, task: 'test', phase: 'pre' });
    await testCodeTask({ directory, type, ui });
    await runPreOrPostTask({ directory, ui, task: 'test', phase: 'post' });
  }
};

module.exports = testCommand;

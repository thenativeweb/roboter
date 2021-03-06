'use strict';

const dependenciesTask = require('../tasks/dependencies'),
      globalOptionDefinitions = require('../globalOptionDefinitions'),
      runPreOrPostTask = require('../tasks/runPreOrPostTask'),
      ui = require('../ui');

const deps = {
  description: 'Check for missing, outdated, and unused dependencies.',

  async getOptionDefinitions () {
    return [];
  },

  async run (options) {
    if (!options) {
      throw new Error('Options are missing.');
    }

    const directory = process.cwd(),
          { help } = options;

    if (help) {
      return ui.printUsage([
        { header: 'roboter deps', content: this.description },
        { header: 'Synopsis', content: 'roboter deps' },
        { header: 'Options', optionList: [ ...await this.getOptionDefinitions(), ...globalOptionDefinitions ]}
      ]);
    }

    await runPreOrPostTask({ directory, ui, task: 'deps', phase: 'pre' });
    await dependenciesTask({ directory, ui });
    await runPreOrPostTask({ directory, ui, task: 'deps', phase: 'post' });
  }
};

module.exports = deps;

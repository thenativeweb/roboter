'use strict';

const analyseCodeTask = require('../tasks/analyse'),
      globalOptionDefinitions = require('../globalOptionDefinitions'),
      runPreOrPostTask = require('../tasks/runPreOrPostTask'),
      ui = require('../ui');

const analyse = {
  description: 'Run code analysis.',

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
        { header: 'roboter analyse', content: this.description },
        { header: 'Synopsis', content: 'roboter analyse' },
        { header: 'Options', optionList: [ ...await this.getOptionDefinitions(), ...globalOptionDefinitions ]}
      ]);
    }

    await this.runTasks({ directory });
  },

  async runTasks ({ directory }) {
    if (!directory) {
      throw new Error('Directory is missing.');
    }

    await runPreOrPostTask({ directory, ui, task: 'analyse', phase: 'pre' });
    await analyseCodeTask({ directory, ui });
    await runPreOrPostTask({ directory, ui, task: 'analyse', phase: 'post' });
  }
};

module.exports = analyse;

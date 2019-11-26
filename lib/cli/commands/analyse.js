'use strict';

const analyseCodeTask = require('../tasks/analyse'),
      globalOptionDefinitions = require('../globalOptionDefinitions'),
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

    await analyseCodeTask({ directory, ui });
  }
};

module.exports = analyse;

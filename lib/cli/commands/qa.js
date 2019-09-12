'use strict';

const analyseTask = require('../tasks/analyse'),
      checkLicenseCompatibilityTask = require('../tasks/checkLicenseCompatibility'),
      dependenciesTask = require('../tasks/dependencies'),
      globalOptionDefinitions = require('../globalOptionDefinitions'),
      testCodeTask = require('../tasks/testCode'),
      ui = require('../ui');

const deps = {
  description: 'Run code analysis, tests and checks dependencies.',

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
        { header: 'roboter qa', content: this.description },
        { header: 'Synopsis', content: 'roboter qa' },
        { header: 'Options', optionList: [ ...await this.getOptionDefinitions(), ...globalOptionDefinitions ]}
      ]);
    }

    ui.printTaskHeader('quality assurance');

    await analyseTask({ directory, ui });
    await testCodeTask({ directory, ui });
    await dependenciesTask({ directory, ui });
    await checkLicenseCompatibilityTask({ directory, ui });

    ui.printTaskSuccess('Quality assurance successful.');
  }
};

module.exports = deps;

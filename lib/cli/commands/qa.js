'use strict';

const analyseTask = require('../tasks/analyse'),
      checkLicenseCompatibilityTask = require('../tasks/checkLicenseCompatibility'),
      dependenciesTask = require('../tasks/dependencies'),
      globalOptionDefinitions = require('../globalOptionDefinitions'),
      testSteps = require('../../steps/test'),
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

    try {
      await testSteps.testCode({ directory, ui });
    } catch (ex) {
      switch (ex.code) {
        case 'ETESTSMISSING':
          ui.warn('No tests found.');
          break;
        case 'ETESTSFAILED':
          ui.printTaskFailure('Tests failed.');
          throw ex;
        default:
          ui.printTaskFailure('Failed to run tests.');
          throw ex;
      }
    }

    await dependenciesTask({ directory, ui });
    await checkLicenseCompatibilityTask({ directory, ui });

    ui.printTaskSuccess('Quality assurance successful.');
  }
};

module.exports = deps;

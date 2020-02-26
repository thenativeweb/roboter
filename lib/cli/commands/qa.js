'use strict';

const analyseTask = require('../tasks/analyse'),
      checkLicenseCompatibilityTask = require('../tasks/checkLicenseCompatibility'),
      dependenciesTask = require('../tasks/dependencies'),
      globalOptionDefinitions = require('../globalOptionDefinitions'),
      runPreOrPostTask = require('../tasks/runPreOrPostTask'),
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

    await runPreOrPostTask({ directory, ui, task: 'qa', phase: 'pre' });
    ui.printTaskHeader('quality assurance');

    await runPreOrPostTask({ directory, ui, task: 'analyse', phase: 'pre' });
    await analyseTask({ directory, ui });
    await runPreOrPostTask({ directory, ui, task: 'analyse', phase: 'post' });

    await runPreOrPostTask({ directory, ui, task: 'test', phase: 'pre' });
    await testCodeTask({ directory, ui });
    await runPreOrPostTask({ directory, ui, task: 'test', phase: 'post' });

    await runPreOrPostTask({ directory, ui, task: 'deps', phase: 'pre' });
    await dependenciesTask({ directory, ui });
    await runPreOrPostTask({ directory, ui, task: 'deps', phase: 'post' });

    await runPreOrPostTask({ directory, ui, task: 'license', phase: 'pre' });
    await checkLicenseCompatibilityTask({ directory, ui });
    await runPreOrPostTask({ directory, ui, task: 'license', phase: 'post' });

    ui.printTaskSuccess('Quality assurance successful.');
    await runPreOrPostTask({ directory, ui, task: 'qa', phase: 'post' });
  }
};

module.exports = deps;

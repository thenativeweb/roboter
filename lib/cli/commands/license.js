'use strict';

const checkLicenseCompatibilityTask = require('../tasks/checkLicenseCompatibility'),
      globalOptionDefinitions = require('../globalOptionDefinitions'),
      runPreOrPostTask = require('../tasks/runPreOrPostTask'),
      ui = require('../ui');

const license = {
  description: 'Check dependencies for incompatible licenses.',

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
        { header: 'roboter license', content: this.description },
        { header: 'Synopsis', content: 'roboter license' },
        { header: 'Options', optionList: [ ...await this.getOptionDefinitions(), ...globalOptionDefinitions ]}
      ]);
    }

    await runPreOrPostTask({ directory, ui, task: 'license', phase: 'pre' });
    await checkLicenseCompatibilityTask({ directory, ui });
    await runPreOrPostTask({ directory, ui, task: 'license', phase: 'post' });
  }
};

module.exports = license;

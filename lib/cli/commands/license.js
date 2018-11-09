'use strict';

const globalOptionDefinitions = require('../globalOptionDefinitions'),
      pkg = require('../../automation/pkg'),
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

    try {
      await pkg.checkLicenseCompatibility({ directory, ui });

      ui.printTaskSuccess('License check successful.');
    } catch (ex) {
      switch (ex.code) {
        case 'ELICENSEINCOMPATIBLE':
        case 'ELICENSENOTSUPPORTED':
          ui.printTaskFailure('License check failed.');
          break;
        default:
          ui.error('Failed to run license check.');
      }

      throw ex;
    }
  }
};

module.exports = license;

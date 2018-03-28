'use strict';

const buntstift = require('buntstift'),
      getUsage = require('command-line-usage');

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
      return buntstift.info(getUsage([
        { header: 'roboter license', content: this.description },
        { header: 'Synopsis', content: 'roboter license' },
        { header: 'Options', optionList: [ ...await this.getOptionDefinitions(), ...globalOptionDefinitions ]}
      ]));
    }

    ui.progress.show();

    try {
      await pkg.checkLicenseCompatibility({ directory, ui });

      ui.progress.hide();
      ui.printTaskSuccess('License check successful.');
    } catch (ex) {
      ui.progress.hide();

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

'use strict';

const buntstift = require('buntstift'),
      getUsage = require('command-line-usage');

const globalOptionDefinitions = require('../globalOptionDefinitions'),
      pkg = require('../../automation/pkg');

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

    buntstift.line();
    buntstift.info('Running license check...', { prefix: '▸' });

    const stopWaiting = buntstift.wait();

    try {
      await pkg.checkLicenseCompatibility({ directory });

      stopWaiting();
      buntstift.success('License check successful.');
    } catch (ex) {
      stopWaiting();

      switch (ex.code) {
        case 'ELICENSEINCOMPATIBLE':
          break;
        case 'ELICENSENOTSUPPORTED':
          break;
        default:
          buntstift.error('Failed to run license check.');
      }

      throw ex;
    }
  }
};

module.exports = license;

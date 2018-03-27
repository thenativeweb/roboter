'use strict';

const buntstift = require('buntstift'),
      getUsage = require('command-line-usage');

const globalOptionDefinitions = require('../globalOptionDefinitions'),
      pkg = require('../../automation/pkg');

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
      return buntstift.info(getUsage([
        { header: 'roboter deps', content: this.description },
        { header: 'Synopsis', content: 'roboter deps' },
        { header: 'Options', optionList: [ ...await this.getOptionDefinitions(), ...globalOptionDefinitions ]}
      ]));
    }

    buntstift.line();
    buntstift.info('Checking dependencies...', { prefix: '▸' });

    const stopWaiting = buntstift.wait();

    try {
      await pkg.checkForUnusedDependencies({ directory });
    } catch (ex) {
      switch (ex.code) {
        case 'EUNUSEDDEPENDENCIES':
          buntstift.warn('You have unused or missing dependencies.');
          break;
        default:
          stopWaiting();
          buntstift.error('Failed to check for unused dependencies.');
          throw ex;
      }
    }

    try {
      await pkg.checkForOutdatedDependencies({ directory });
    } catch (ex) {
      switch (ex.code) {
        case 'EOUTDATEDDEPENDENCIES':
          buntstift.warn('You have outdated dependencies.');
          break;
        default:
          stopWaiting();
          buntstift.error('Failed to check for outdated dependencies.');
          throw ex;
      }
    }

    stopWaiting();
    buntstift.line();
    buntstift.success('Dependency check successful.');
  }
};

module.exports = deps;

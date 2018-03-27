'use strict';

const buntstift = require('buntstift'),
      getUsage = require('command-line-usage');

const globalOptionDefinitions = require('../globalOptionDefinitions'),
      pkg = require('../../automation/pkg');

const unusedDependencies = {
  description: 'Check for unused dependencies.',

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
        { header: 'roboter unused-dependencies', content: this.description },
        { header: 'Synopsis', content: 'roboter unused-dependencies' },
        { header: 'Options', optionList: [ ...await this.getOptionDefinitions(), ...globalOptionDefinitions ]}
      ]));
    }

    buntstift.line();
    buntstift.info('Checking for unused dependencies...', { prefix: '▸' });

    const stopWaiting = buntstift.wait();

    try {
      await pkg.checkForUnusedDependencies({ directory });

      stopWaiting();
      buntstift.success('You have no unused or missing dependencies.');
    } catch (ex) {
      stopWaiting();

      switch (ex.code) {
        case 'EUNUSEDDEPENDENCIES':
          buntstift.warn('You have unused or missing dependencies.');
          break;
        default:
          buntstift.error('Failed to check for unused dependencies.');
          throw ex;
      }
    }
  }
};

module.exports = unusedDependencies;

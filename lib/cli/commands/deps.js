'use strict';

const globalOptionDefinitions = require('../globalOptionDefinitions'),
      pkg = require('../../automation/pkg'),
      ui = require('../ui');

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
      return ui.printUsage([
        { header: 'roboter deps', content: this.description },
        { header: 'Synopsis', content: 'roboter deps' },
        { header: 'Options', optionList: [ ...await this.getOptionDefinitions(), ...globalOptionDefinitions ]}
      ]);
    }

    ui.printTaskHeader('dependency check');
    ui.progress.show();

    try {
      await pkg.checkForUnusedDependencies({ directory, ui });
    } catch (ex) {
      switch (ex.code) {
        case 'EUNUSEDDEPENDENCIES':
          break;
        default:
          ui.progress.hide();
          ui.printTaskFailure('Failed to check for unused dependencies.');
          throw ex;
      }
    }

    try {
      await pkg.checkForOutdatedDependencies({ directory, ui });
    } catch (ex) {
      switch (ex.code) {
        case 'EOUTDATEDDEPENDENCIES':
          break;
        default:
          ui.progress.hide();
          ui.printTaskFailure('Failed to check for outdated dependencies.');
          throw ex;
      }
    }

    ui.progress.hide();
    ui.printTaskSuccess('Dependency check successful.');
  }
};

module.exports = deps;

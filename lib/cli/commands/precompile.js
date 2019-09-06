'use strict';

const isTypeScript = require('is-typescript').default;

const globalOptionDefinitions = require('../globalOptionDefinitions'),
      pkg = require('../../automation/pkg'),
      ui = require('../ui');

const precompile = {
  description: 'Precompile source files using TypeScript.',

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
        { header: 'roboter precompile', content: this.description },
        { header: 'Synopsis', content: 'roboter precompile' },
        { header: 'Options', optionList: [ ...await this.getOptionDefinitions(), ...globalOptionDefinitions ]}
      ]);
    }

    ui.printTaskHeader('precompile');

    try {
      if (!await isTypeScript({ directory })) {
        ui.warn('No TypeScript found, skipping precompilation.');

        return;
      }

      await pkg.precompile({ directory, ui });

      ui.printTaskSuccess('Successfully precompiled sources.');
    } catch (ex) {
      switch (ex.code) {
        default:
          ui.printTaskFailure('Failed to precompile.');
      }

      throw ex;
    }
  }
};

module.exports = precompile;

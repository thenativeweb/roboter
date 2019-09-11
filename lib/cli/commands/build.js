'use strict';

const isTypeScript = require('is-typescript').default;

const { build: buildStep } = require('../../steps/build'),
      globalOptionDefinitions = require('../globalOptionDefinitions'),
      ui = require('../ui');

const build = {
  description: 'Build a project using TypeScript.',

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
        { header: 'roboter build', content: this.description },
        { header: 'Synopsis', content: 'roboter build' },
        { header: 'Options', optionList: [ ...await this.getOptionDefinitions(), ...globalOptionDefinitions ]}
      ]);
    }

    ui.printTaskHeader('build');

    try {
      if (!await isTypeScript({ directory })) {
        ui.warn('No TypeScript found, skipping precompilation.');

        return;
      }

      await buildStep({ directory, ui });

      ui.printTaskSuccess('Successfully buildd sources.');
    } catch (ex) {
      switch (ex.code) {
        default:
          ui.printTaskFailure('Failed to build.');
      }

      throw ex;
    }
  }
};

module.exports = build;

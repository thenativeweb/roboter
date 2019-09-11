'use strict';

const globalOptionDefinitions = require('../globalOptionDefinitions'),
      { analyseCode: analyseCodeStep } = require('../../steps/analyse'),
      ui = require('../ui'),
      watchFilesAndExecute = require('../../watchFilesAndExecute');

const analyse = {
  description: 'Run code analysis.',

  async getOptionDefinitions () {
    return [
      {
        name: 'watch',
        alias: 'w',
        type: Boolean,
        defaultValue: false,
        description: 'watch files'
      }
    ];
  },

  async run (options) {
    if (!options) {
      throw new Error('Options are missing.');
    }
    if (options.watch === undefined) {
      throw new Error('Watch is missing.');
    }

    const directory = process.cwd(),
          { help, watch } = options;

    if (help) {
      return ui.printUsage([
        { header: 'roboter analyse', content: this.description },
        { header: 'Synopsis', content: 'roboter analyse [--watch]' },
        { header: 'Options', optionList: [ ...await this.getOptionDefinitions(), ...globalOptionDefinitions ]}
      ]);
    }

    if (watch) {
      await watchFilesAndExecute({
        message: 'Running code analysis in watch mode...',
        files: await analyseCodeStep.getFiles({ directory }),
        execute: async () => await analyseCodeStep({ directory, printSuccess: true, ui }),
        executeOnStart: true
      });
    }

    try {
      await analyseCodeStep({ directory, ui });

      ui.printTaskSuccess('Code analysis successful.');
    } catch (ex) {
      switch (ex.code) {
        case 'ECODEMALFORMED':
          ui.printTaskFailure('Code analysis failed.');
          break;
        default:
          ui.printTaskFailure('Failed to run code analysis.');
      }

      throw ex;
    }
  }
};

module.exports = analyse;

'use strict';

const analyseCodeStep = require('../tasks/analyse'),
      globalOptionDefinitions = require('../globalOptionDefinitions'),
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
        execute: async () => await this.runTasks({ directory })
      });
    }

    await this.runTasks({ directory });
  },

  async runTasks ({ directory }) {
    if (!directory) {
      throw new Error('Directory is missing.');
    }

    await analyseCodeStep({ directory, ui });
  }
};

module.exports = analyse;

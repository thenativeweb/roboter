'use strict';

const buntstift = require('buntstift'),
      getUsage = require('command-line-usage');

const globalOptionDefinitions = require('../globalOptionDefinitions'),
      quality = require('../../automation/quality'),
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
      return buntstift.info(getUsage([
        { header: 'roboter analyse', content: this.description },
        { header: 'Synopsis', content: 'roboter analyse' },
        { header: 'Options', optionList: [ ...await this.getOptionDefinitions(), ...globalOptionDefinitions ]}
      ]));
    }

    if (watch) {
      await watchFilesAndExecute({
        message: 'Running code analysis in watch mode...',
        files: await quality.analyseCode.getFiles({ directory }),
        execute: async () => await quality.analyseCode({ directory, printSuccess: true })
      });
    }

    const stopWaiting = buntstift.wait();

    try {
      await quality.analyseCode({ directory });

      stopWaiting();
      buntstift.line();
      buntstift.success('Code analysis successful.');
    } catch (ex) {
      stopWaiting();

      switch (ex.code) {
        case 'ECODEMALFORMED':
          buntstift.error('Code analysis failed.');
          break;
        default:
          buntstift.error('Failed to run code analysis.');
      }

      throw ex;
    }
  }
};

module.exports = analyse;

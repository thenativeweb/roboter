'use strict';

const path = require('path');

const files = require('../../files'),
      globalOptionDefinitions = require('../globalOptionDefinitions'),
      pkg = require('../../automation/pkg'),
      ui = require('../ui');

const precompile = {
  description: 'Precompile source files using babel.',

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
      const sourcePath = path.join(directory, 'src');
      const hasSourceDirectory = await files.exists({ path: sourcePath });

      if (hasSourceDirectory) {
        await pkg.precompile({ directory, sourcePath, distributionPath: path.join(directory, 'dist'), ui });
      }

      ui.printTaskSuccess(`Successfully precompiled sources.`);
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

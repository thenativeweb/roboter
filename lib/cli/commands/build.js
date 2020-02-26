'use strict';

const buildTask = require('../tasks/build'),
      globalOptionDefinitions = require('../globalOptionDefinitions'),
      runPreOrPostTask = require('../tasks/runPreOrPostTask'),
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

    await runPreOrPostTask({ directory, ui, task: 'build', phase: 'pre' });
    await buildTask({ directory, ui });
    await runPreOrPostTask({ directory, ui, task: 'build', phase: 'post' });
  }
};

module.exports = build;

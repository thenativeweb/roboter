'use strict';

const ui = require('../ui');

const help = {
  description: 'Show the help.',

  async getOptionDefinitions () {
    return [];
  },

  async run () {
    // Since we have a cyclic dependency here, we need to call this require
    // at runtime, not at load-time.

    /* eslint-disable global-require */
    const commands = require('./index');
    /* eslint-enable global-require */

    ui.printUsage([
      { header: 'roboter', content: 'Manages builds.' },
      { header: 'Synopsis', content: 'roboter <command> [options]' },
      {
        header: 'Commands',
        content: Object.keys(commands).
          map(command => ({
            name: command,
            description: commands[command].description
          })).
          filter(command => command.description)
      }
    ]);
  }
};

module.exports = help;

import { analyseCommand } from './analyse/analyseCommand';
import { buildCommand } from './analyse/buildCommand';
import { Command } from 'command-line-interface';
import { RootOptions } from './RootOptions';

const rootCommand = function (): Command<RootOptions> {
  return {
    name: 'roboter',
    description: 'roboter streamlines software development by automating tasks and enforcing conventions.',

    optionDefinitions: [
      {
        name: 'verbose',
        alias: 'v',
        description: 'enable verbose mode',
        type: 'boolean',
        isRequired: false,
        defaultValue: false
      }
    ],

    handle ({ getUsage }): void {
      /* eslint-disable no-console */
      console.log(getUsage({ commandPath: [ 'roboter' ]}));
      /* eslint-enable no-console */
    },

    subcommands: {
      analyse: analyseCommand(),
      build: buildCommand()
    }
  };
};

export { rootCommand };

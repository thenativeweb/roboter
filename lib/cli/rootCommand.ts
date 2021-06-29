import { analyseCommand } from './analyse/analyseCommand';
import { buildCommand } from './build/buildCommand';
import { buntstift } from 'buntstift';
import { Command } from 'command-line-interface';
import { depsCommand } from './deps/depsCommand';
import packageJson from '../../package.json';
import { qaCommand } from './qa/qaCommand';
import { RootOptions } from './RootOptions';
import { testCommand } from './test/testCommand';

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
      },
      {
        name: 'version',
        description: 'show the version',
        type: 'boolean',
        isRequired: false,
        defaultValue: false
      }
    ],

    async handle ({ options: {
      verbose,
      version
    }}): Promise<void> {
      buntstift.configure(
        buntstift.getConfiguration().
          withVerboseMode(verbose)
      );

      if (version) {
        buntstift.info(packageJson.version);

        return;
      }

      buntstift.warn('Not implemented yet. Use --help.');
    },

    subcommands: {
      analyse: analyseCommand(),
      build: buildCommand(),
      deps: depsCommand(),
      qa: qaCommand(),
      test: testCommand()
    }
  };
};

export { rootCommand };

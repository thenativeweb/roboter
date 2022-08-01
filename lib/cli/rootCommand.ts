import { analyzeCommand } from './analyze/analyzeCommand';
import { buildCommand } from './build/buildCommand';
import { buntstift } from 'buntstift';
import { Command } from 'command-line-interface';
import { depsCommand } from './deps/depsCommand';
import { licenseCommand } from './license/licenseCommand';
import packageJson from '../../package.json' assert { type: 'json' };
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
      },
      {
        name: 'no-bail',
        alias: 'b',
        description: 'do not end test execution as soon a a test fails',
        type: 'boolean',
        isRequired: false,
        defaultValue: false
      }
    ],

    async handle ({
      options,
      ancestors,
      getUsage,
      level
    }): Promise<void> {
      buntstift.configure(
        buntstift.getConfiguration().
          withVerboseMode(options.verbose)
      );

      if (options.version) {
        buntstift.info(packageJson.version);

        return;
      }
      await qaCommand().handle({
        options,
        ancestors: [ ...ancestors, 'qa' ],
        getUsage,
        level: level + 1
      });
    },

    subcommands: {
      analyze: analyzeCommand(),
      build: buildCommand(),
      deps: depsCommand(),
      license: licenseCommand(),
      qa: qaCommand(),
      test: testCommand()
    }
  };
};

export { rootCommand };

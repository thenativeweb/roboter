import { buntstift } from 'buntstift';
import { Command } from 'command-line-interface';
import { exit } from '../../utils/exit';
import { getApplicationRoot } from '../../utils/getApplicationRoot';
import { runPreOrPostScript } from '../../tasks/runPreOrPostScript';
import { setupCommand } from './setup/setupCommand';
import { teardownCommand } from './teardown/teardownCommand';
import { TestOptions } from './TestOptions';
import { testTask } from '../../tasks/testTask';

const testCommand = function (): Command<TestOptions> {
  return {
    name: 'test',
    description: 'Runs tests',
    optionDefinitions: [
      {
        name: 'watch',
        alias: 'w',
        description: 'Watches the project and aborts and re-runs the tests when files change.',
        type: 'boolean',
        defaultValue: false
      }
    ],
    async handle ({ options: {
      verbose,
      watch
    }}): Promise <void> {
      buntstift.configure(
        buntstift.getConfiguration().
          withVerboseMode(verbose)
      );

      const applicationRootResult = await getApplicationRoot({
        directory: process.cwd()
      });

      if (applicationRootResult.hasError()) {
        buntstift.error('Roboter must be ran in an npm project.');

        return exit(1);
      }
      const applicationRoot = applicationRootResult.value;

      await runPreOrPostScript({
        applicationRoot,
        task: 'test',
        phase: 'pre'
      });

      (await testTask({ applicationRoot, watch })).unwrapOrThrow();

      if (!watch) {
        await runPreOrPostScript({
          applicationRoot,
          task: 'test',
          phase: 'post'
        });
      }
    },
    subcommands: {
      setup: setupCommand(),
      teardown: teardownCommand()
    }
  };
};

export {
  testCommand
};

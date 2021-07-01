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
        name: 'type',
        alias: 't',
        description: 'Run only the tests for this test type.',
        type: 'string',
        isRequired: false
      },
      {
        name: 'no-bail',
        alias: 'b',
        description: 'Do not end test execution as soon a a test fails.',
        type: 'boolean',
        isRequired: false,
        defaultValue: false
      },
      {
        name: 'watch',
        alias: 'w',
        description: 'Watches the project and aborts and re-runs the tests when files change.',
        type: 'boolean',
        defaultValue: false,
        isRequired: false
      },
      {
        name: 'grep',
        alias: 'g',
        description: 'Matches the test descriptions against a regex and only executes ones that match.',
        type: 'string',
        isRequired: false
      }
    ],
    async handle ({ options: {
      verbose,
      type,
      'no-bail': noBail,
      watch,
      grep
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

      const testResult = await testTask({
        applicationRoot,
        type,
        bail: !noBail,
        watch,
        grep: grep ? new RegExp(grep, 'u') : undefined
      });

      if (testResult.hasError()) {
        return exit(1);
      }

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

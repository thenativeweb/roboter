import { buntstift } from 'buntstift';
import { Command } from 'command-line-interface';
import { exit } from '../../utils/exit';
import { getApplicationRoot } from '../../utils/getApplicationRoot';
import { runPreOrPostScript } from '../../tasks/runPreOrPostScript';
import { TestOptions } from './TestOptions';
import { testTask } from '../../tasks/testTask';

const testCommand = function (): Command<TestOptions> {
  return {
    name: 'test',
    description: 'Runs tests.',
    optionDefinitions: [
      {
        name: 'type',
        alias: 't',
        description: 'run only the tests for this test type',
        type: 'string',
        isRequired: false
      },
      {
        name: 'no-bail',
        alias: 'b',
        description: 'do not end test execution as soon a a test fails',
        type: 'boolean',
        isRequired: false,
        defaultValue: false
      },
      {
        name: 'watch',
        alias: 'w',
        description: 'watch the project and abort and re-run the tests when files change',
        type: 'boolean',
        defaultValue: false,
        isRequired: false
      },
      {
        name: 'grep',
        alias: 'g',
        description: 'match the test descriptions against a regex and only execute the ones that match',
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
        buntstift.error('Roboter must be run in an npm project.');

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

      await runPreOrPostScript({
        applicationRoot,
        task: 'test',
        phase: 'post'
      });
    }
  };
};

export {
  testCommand
};

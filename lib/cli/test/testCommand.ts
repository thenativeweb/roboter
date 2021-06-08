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
    description: 'Runs tests',
    optionDefinitions: [],
    async handle ({ options: {
      verbose
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

      (await testTask({ applicationRoot })).unwrapOrThrow();

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

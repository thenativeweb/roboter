import { buntstift } from 'buntstift';
import { Command } from 'command-line-interface';
import { exit } from '../../../utils/exit';
import { getApplicationRoot } from '../../../utils/getApplicationRoot';
import { runPreOrPostScript } from '../../../tasks/runPreOrPostScript';
import { TeardownOptions } from './TeardownOptions';
import { testTeardownTask } from '../../../tasks/testTeardownTask';

const teardownCommand = function (): Command<TeardownOptions> {
  return {
    name: 'teardown',
    description: 'Runs the test teardown, if one is configured',
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
        task: 'test-teardown',
        phase: 'pre'
      });

      (await testTeardownTask({ applicationRoot })).unwrapOrThrow();

      await runPreOrPostScript({
        applicationRoot,
        task: 'test-teardown',
        phase: 'post'
      });
    }
  };
};

export {
  teardownCommand
};

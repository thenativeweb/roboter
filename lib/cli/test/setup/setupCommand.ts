import { buntstift } from 'buntstift';
import { Command } from 'command-line-interface';
import { exit } from '../../../utils/exit';
import { getApplicationRoot } from '../../../utils/getApplicationRoot';
import { runPreOrPostScript } from '../../../tasks/runPreOrPostScript';
import { SetupOptions } from './SetupOptions';
import { testSetupTask } from '../../../tasks/testSetupTask';

const setupCommand = function (): Command<SetupOptions> {
  return {
    name: 'setup',
    description: 'Runs the test setup, if one is configured',
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
        task: 'test-setup',
        phase: 'pre'
      });

      (await testSetupTask({ applicationRoot })).unwrapOrThrow();

      await runPreOrPostScript({
        applicationRoot,
        task: 'test-setup',
        phase: 'post'
      });
    }
  };
};

export {
  setupCommand
};

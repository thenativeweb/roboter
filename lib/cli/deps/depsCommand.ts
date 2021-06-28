import { buntstift } from 'buntstift';
import { Command } from 'command-line-interface';
import { dependencyCheckTask } from '../../tasks/dependencyCheckTask';
import { DepsOptions } from './DepsOptions';
import { exit } from '../../utils/exit';
import { getApplicationRoot } from '../../utils/getApplicationRoot';
import { runPreOrPostScript } from '../../tasks/runPreOrPostScript';

const depsCommand = function (): Command<DepsOptions> {
  return {
    name: 'deps',
    description: 'Check for missing, outdated, and unused dependencies.',
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
        task: 'deps',
        phase: 'pre'
      });

      const dependencyCheckResult = await dependencyCheckTask({ applicationRoot });

      if (dependencyCheckResult.hasError()) {
        return exit(1);
      }

      await runPreOrPostScript({
        applicationRoot,
        task: 'deps',
        phase: 'post'
      });
    }
  };
};

export {
  depsCommand
};

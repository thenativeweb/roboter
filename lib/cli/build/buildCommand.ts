import { BuildOptions } from './BuildOptions';
import { buildTask } from '../../tasks/buildTask';
import { buntstift } from 'buntstift';
import { Command } from 'command-line-interface';
import { exit } from '../../utils/exit';
import { getApplicationRoot } from '../../utils/getApplicationRoot';
import { runPreOrPostScript } from '../../tasks/runPreOrPostScript';

const buildCommand = function (): Command<BuildOptions> {
  return {
    name: 'build',
    description: 'Compiles TypeScript',
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
        task: 'build',
        phase: 'pre'
      });

      const buildResult = await buildTask({ applicationRoot });

      if (buildResult.hasError()) {
        return exit(1);
      }

      await runPreOrPostScript({
        applicationRoot,
        task: 'build',
        phase: 'post'
      });
    }
  };
};

export {
  buildCommand
};

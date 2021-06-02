import { AnalyseOptions } from './AnalyseOptions';
import { analyseTask } from '../../tasks/analyseTask';
import { buntstift } from 'buntstift';
import { Command } from 'command-line-interface';
import { exit } from '../../utils/exit';
import { getApplicationRoot } from '../../utils/getApplicationRoot';
import { runPreOrPostScript } from '../../tasks/runPreOrPostScript';

const analyseCommand = function (): Command<AnalyseOptions> {
  return {
    name: 'analyse',
    description: 'Analyses code quality',
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
        task: 'analyse',
        phase: 'pre'
      });

      (await analyseTask({ applicationRoot })).unwrapOrThrow();

      await runPreOrPostScript({
        applicationRoot,
        task: 'analyse',
        phase: 'post'
      });
    }
  };
};

export {
  analyseCommand
};

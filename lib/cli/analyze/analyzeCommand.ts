import { AnalyzeOptions } from './AnalyzeOptions';
import { analyzeTask } from '../../tasks/analyzeTask';
import { buntstift } from 'buntstift';
import { Command } from 'command-line-interface';
import { exit } from '../../utils/exit';
import { getApplicationRoot } from '../../utils/getApplicationRoot';
import { runPreOrPostScript } from '../../tasks/runPreOrPostScript';

const analyzeCommand = function (): Command<AnalyzeOptions> {
  return {
    name: 'analyze',
    description: 'Analyzes code quality.',
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
        buntstift.error('Roboter must be run in an npm project.');

        return exit(1);
      }
      const applicationRoot = applicationRootResult.value;

      await runPreOrPostScript({
        applicationRoot,
        task: 'analyze',
        phase: 'pre'
      });

      const analyzeTaskResult = await analyzeTask({ applicationRoot });

      if (analyzeTaskResult.hasError()) {
        return exit(1);
      }

      await runPreOrPostScript({
        applicationRoot,
        task: 'analyze',
        phase: 'post'
      });
    }
  };
};

export {
  analyzeCommand
};

import { analyseTask } from '../../tasks/analyseTask';
import { buntstift } from 'buntstift';
import { checkLicenseCompatibilityTask } from '../../tasks/checkLicenseCompatibilityTask';
import { Command } from 'command-line-interface';
import { dependencyCheckTask } from '../../tasks/dependencyCheckTask';
import { exit } from '../../utils/exit';
import { getApplicationRoot } from '../../utils/getApplicationRoot';
import { QaOptions } from './QaOptions';
import { runPreOrPostScript } from '../../tasks/runPreOrPostScript';
import { testTask } from '../../tasks/testTask';

const qaCommand = function (): Command<QaOptions> {
  return {
    name: 'qa',
    description: 'Run code analysis, tests, checks dependencies and license compatibility.',
    optionDefinitions: [],
    async handle ({ options: {
      'no-bail': noBail,
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
        task: 'qa',
        phase: 'pre'
      });

      await runPreOrPostScript({
        applicationRoot,
        task: 'analyse',
        phase: 'pre'
      });

      const analyseTaskResult = await analyseTask({ applicationRoot });

      if (analyseTaskResult.hasError()) {
        return exit(1);
      }

      await runPreOrPostScript({
        applicationRoot,
        task: 'analyse',
        phase: 'post'
      });

      await runPreOrPostScript({
        applicationRoot,
        task: 'test',
        phase: 'pre'
      });

      const testTaskResult = await testTask({ applicationRoot, bail: !noBail, watch: false });

      if (testTaskResult.hasError()) {
        return exit(1);
      }

      await runPreOrPostScript({
        applicationRoot,
        task: 'test',
        phase: 'post'
      });

      await runPreOrPostScript({
        applicationRoot,
        task: 'deps',
        phase: 'pre'
      });

      const depsTaskResult = await dependencyCheckTask({ applicationRoot });

      if (depsTaskResult.hasError()) {
        return exit(1);
      }

      await runPreOrPostScript({
        applicationRoot,
        task: 'deps',
        phase: 'post'
      });

      await runPreOrPostScript({
        applicationRoot,
        task: 'license',
        phase: 'pre'
      });

      const licenseTaskResult = await checkLicenseCompatibilityTask({ applicationRoot });

      if (licenseTaskResult.hasError()) {
        return exit(1);
      }

      await runPreOrPostScript({
        applicationRoot,
        task: 'license',
        phase: 'post'
      });

      await runPreOrPostScript({
        applicationRoot,
        task: 'qa',
        phase: 'post'
      });
    }
  };
};

export {
  qaCommand
};

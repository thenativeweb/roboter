import { buntstift } from 'buntstift';
import { checkLicenseCompatibilityTask } from '../../tasks/checkLicenseCompatibilityTask';
import { Command } from 'command-line-interface';
import { exit } from '../../utils/exit';
import { getApplicationRoot } from '../../utils/getApplicationRoot';
import { LicenseOptions } from './LicenseOptions';
import { runPreOrPostScript } from '../../tasks/runPreOrPostScript';

const licenseCommand = function (): Command<LicenseOptions> {
  return {
    name: 'license',
    description: 'Check dependencies for incompatible licenses.',
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
        task: 'license',
        phase: 'pre'
      });

      const licenseResult = await checkLicenseCompatibilityTask({ applicationRoot });

      if (licenseResult.hasError()) {
        buntstift.error('License check failed.');

        return exit(1);
      }

      await runPreOrPostScript({
        applicationRoot,
        task: 'license',
        phase: 'post'
      });
    }
  };
};

export {
  licenseCommand
};

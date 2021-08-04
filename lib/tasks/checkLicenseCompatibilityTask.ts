import { buntstift } from 'buntstift';
import { findIncompatiblePackages } from '../steps/license/findIncompatiblePackages';
import { getLicenseCheckConfiguration } from '../steps/license/getLicenseCheckConfiguration';
import { error, Result, value } from 'defekt';
import * as errors from '../errors';

const checkLicenseCompatibilityTask = async function ({ applicationRoot }: {
  applicationRoot: string;
}): Promise<Result<undefined, errors.LicenseIncompatible>> {
  buntstift.line();
  buntstift.info(`Running license check...`, { prefix: '▸' });

  const licenseCheckConfigurationResult = await getLicenseCheckConfiguration({ absoluteDirectory: applicationRoot });

  if (licenseCheckConfigurationResult.hasError()) {
    switch (licenseCheckConfigurationResult.error.code) {
      case errors.LicenseCheckConfigurationNotFound.code: {
        buntstift.warn('No list of compatible licenses found. Skipping license compatibility check...');

        return value();
      }
      case errors.LicenseCheckConfigurationMalformed.code: {
        buntstift.error('The license check configuration is malformed.');
        buntstift.error(licenseCheckConfigurationResult.error.message);

        return error(new errors.LicenseIncompatible({
          cause: licenseCheckConfigurationResult.error
        }));
      }
      default: {
        // This would not compile if the above cases were not exhaustive.
        return {} as never;
      }
    }
  }

  const licenseCheckConfiguration = licenseCheckConfigurationResult.value;

  const incompatiblePackages = await findIncompatiblePackages({
    licenseCheckConfiguration,
    absoluteDirectory: applicationRoot
  });

  if (incompatiblePackages.length > 0) {
    const table: Record<string, string>[] = [];

    incompatiblePackages.forEach((incompatiblePackage): void => {
      table.push({
        package: incompatiblePackage.name,
        version: incompatiblePackage.version,
        license: incompatiblePackage.license,
        path: incompatiblePackage.directory
      });
    });

    buntstift.table(table);
    buntstift.warn('There are incompatible dependencies.');

    return error(new errors.LicenseIncompatible());
  }

  buntstift.line();
  buntstift.success('License check successful.');

  return value();
};

export {
  checkLicenseCompatibilityTask
};


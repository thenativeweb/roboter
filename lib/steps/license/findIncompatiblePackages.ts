import { getAbsoluteDependencyDirectoryList } from '../../utils/getDependencyList';
import { getLicense } from './getLicense';
import { getPackageJson } from '../../utils/getPackageJson';
import { isCustomError } from 'defekt';
import { LicenseCheckConfiguration } from './LicenseCheckConfiguration';
import satisfies from 'spdx-satisfies';
import * as errors from '../../errors';

interface Package {
  name: string;
  version: string;
  license: string;
  directory: string;
}

const findIncompatiblePackages = async function ({
  licenseCheckConfiguration,
  absoluteDirectory
}: {
  licenseCheckConfiguration: LicenseCheckConfiguration;
  absoluteDirectory: string;
}): Promise<Package[]> {
  const absoluteDependencyDirectories = await getAbsoluteDependencyDirectoryList({
    absoluteDirectory
  });
  const incompatiblePackages: Package[] = [];

  for (const absoluteDependencyDirectory of absoluteDependencyDirectories) {
    // It should not be possible that a dependency has no package.json
    const packageJson = (await getPackageJson({
      absoluteDirectory: absoluteDependencyDirectory
    })).unwrapOrThrow();

    const getLicenseResult = await getLicense({
      absoluteDirectory: absoluteDependencyDirectory,
      licenseCheckConfiguration
    });

    if (getLicenseResult.hasError()) {
      if (isCustomError(getLicenseResult.error, errors.LicenseNotSupported)) {
        incompatiblePackages.push({
          name: packageJson.name!,
          directory: absoluteDependencyDirectory,
          license: getLicenseResult.error.data.license,
          version: packageJson.version!
        });
      }
      if (isCustomError(getLicenseResult.error, errors.LicenseNotFound)) {
        incompatiblePackages.push({
          name: packageJson.name!,
          directory: absoluteDependencyDirectory,
          license: 'unknown',
          version: packageJson.version!
        });
      }

      continue;
    }

    const packageLicense = getLicenseResult.value;
    const packageVersion = packageJson.version!;

    if (licenseCheckConfiguration.compatibleLicenses!.some((license): boolean => satisfies(license, packageLicense))) {
      continue;
    }

    incompatiblePackages.push({
      name: packageJson.name!,
      version: packageVersion,
      license: packageLicense,
      directory: absoluteDependencyDirectory
    });
  }

  return incompatiblePackages;
};

export {
  findIncompatiblePackages
};

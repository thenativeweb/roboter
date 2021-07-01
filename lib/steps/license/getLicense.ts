import { getPackageJson } from '../../utils/getPackageJson';
import { LicenseCheckConfiguration } from './LicenseCheckConfiguration';
import { packageLicenses } from '../../../configuration/packageLicenses';
import parse from 'spdx-expression-parse';
import { error, Result, value } from 'defekt';
import * as errors from '../../errors';

const getLicense = async function ({ absoluteDirectory, licenseCheckConfiguration }: {
  absoluteDirectory: string;
  licenseCheckConfiguration: LicenseCheckConfiguration;
}): Promise<Result<string, errors.LicenseNotFound | errors.LicenseNotSupported>> {
  const packageJsonResult = await getPackageJson({ absoluteDirectory });

  if (packageJsonResult.hasError()) {
    return error(new errors.LicenseNotFound());
  }

  const packageJson = packageJsonResult.value;

  let licenseString: string = '';

  // The `packageJson.licenses` field is not valid anymore, but unfortunately
  // still in use. (https://docs.npmjs.com/cli/v7/configuring-npm/package-json#license)
  if (packageJson.licenses) {
    const licenses: string[] = [];

    for (const license of packageJson.licenses) {
      if (typeof license === 'object') {
        licenses.push(license.type!);
      } else {
        licenses.push(license);
      }
    }

    if (licenses.length === 1) {
      licenseString = licenses[0];
    } else {
      licenseString = `(${licenses.join(' AND ')})`;
    }
  }
  if (packageJson.license) {
    // Somehow some packages use an object as their license but type-fest does
    // not support this.
    if (typeof packageJson.license === 'object' && (packageJson.license as any).type) {
      licenseString = (packageJson.license as any).type;
    } else {
      licenseString = packageJson.license;
    }
  }

  const packageName = packageJson.name;
  const packageVersion = packageJson.version;

  if (!packageName || !packageVersion) {
    return error(new errors.LicenseNotFound());
  }

  let knownPackageLicense: string | undefined;

  knownPackageLicense = licenseCheckConfiguration.knownPackageLicenses?.[packageName]?.[packageVersion];
  if (!knownPackageLicense) {
    knownPackageLicense = packageLicenses[packageName]?.[packageVersion];
  }

  if (knownPackageLicense) {
    licenseString = knownPackageLicense;
  }

  try {
    parse(licenseString);
  } catch (ex: unknown) {
    return error(new errors.LicenseNotSupported({ cause: ex, data: { license: licenseString }}));
  }

  return value(licenseString);
};

export {
  getLicense
};

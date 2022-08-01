import deprecatedSpdxLicenseIds from 'spdx-license-ids/deprecated.json' assert { type: 'json' };
import { getLicense } from '../license/getLicense';
import { getLicenseCheckConfiguration } from '../license/getLicenseCheckConfiguration';
import { error, Result, value } from 'defekt';
import * as errors from '../../errors';

const checkLicenseExpression = async function ({
  applicationRoot
}: {
  applicationRoot: string;
}): Promise<Result<undefined, errors.LicenseNotFound | errors.LicenseNotSupported | errors.LicenseDeprecated>> {
  const licenseCheckConfigurationResult = await getLicenseCheckConfiguration({ absoluteDirectory: applicationRoot });
  const licenseCheckConfiguration = licenseCheckConfigurationResult.hasValue() ? licenseCheckConfigurationResult.value : undefined;

  const licenseResult = await getLicense({ absoluteDirectory: applicationRoot, licenseCheckConfiguration });

  if (licenseResult.hasError()) {
    if (licenseResult.error.code === errors.LicenseNotSupported.code && licenseCheckConfiguration?.allowUnsupportedLicenseForThisPackage) {
      return value();
    }

    return error(new errors.LicenseNotSupported({
      message: `The given license is not supported, please check your spelling, or disable this check by setting 'allowUnsupportedLicenseForThisPackage' in licenseCheck.json.`,
      cause: licenseResult.error
    }));
  }

  const license = licenseResult.unwrapOrThrow();

  if (deprecatedSpdxLicenseIds.includes(license) && !licenseCheckConfiguration?.allowDeprecatedLicenseForThisPackage) {
    return error(new errors.LicenseDeprecated({
      message: `${license} is deprecated, please consider using an updated version of this license, or disable this check by setting 'allowDeprecatedLicenseForThisPackage' in licenseCheck.json.`
    }));
  }

  return value();
};

export {
  checkLicenseExpression
};

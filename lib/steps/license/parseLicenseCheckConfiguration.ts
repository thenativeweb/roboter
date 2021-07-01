import { LicenseCheckConfiguration } from './LicenseCheckConfiguration';
import { parse } from 'validate-value';
import semver from 'semver';
import { error, Result, value } from 'defekt';
import * as errors from '../../errors';

const parseLicenseCheckConfiguration = function (unparsedValue: object): Result<
LicenseCheckConfiguration,
errors.LicenseCheckConfigurationMalformed
> {
  const parseResult = parse<LicenseCheckConfiguration>(
    unparsedValue,
    {
      type: 'object',
      properties: {
        compatibleLicenses: {
          type: 'array',
          items: {
            type: 'string',
            minLength: 1
          }
        },
        knownPackageLicenses: {
          type: 'object',
          patternProperties: {
            '.*': {
              type: 'object',
              patternProperties: {
                '.*': {
                  type: 'string',
                  minLength: 1
                }
              }
            }
          }
        }
      },
      required: [ 'compatibleLicenses' ],
      additionalProperties: false
    },
    { valueName: 'licenseCheckConfiguration' }
  );

  if (parseResult.hasError()) {
    return error(new errors.LicenseCheckConfigurationMalformed({
      message: parseResult.error.message,
      cause: parseResult.error
    }));
  }

  const licenseCheckConfiguration = parseResult.value;

  if (licenseCheckConfiguration.knownPackageLicenses) {
    for (const [ packageName, packageLicenses ] of Object.entries(licenseCheckConfiguration.knownPackageLicenses)) {
      for (const packageVersion of Object.keys(packageLicenses)) {
        if (!semver.valid(packageVersion)) {
          return error(new errors.LicenseCheckConfigurationMalformed({
            message: 'A package version in the known package licenses configuration is not valid semver.',
            data: { packageName, packageVersion }
          }));
        }
      }
    }
  }

  return value(licenseCheckConfiguration);
};

export {
  parseLicenseCheckConfiguration
};

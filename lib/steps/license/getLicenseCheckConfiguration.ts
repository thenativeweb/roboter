import fs from 'fs';
import { JsonObject } from 'type-fest';
import { LicenseCheckConfiguration } from './LicenseCheckConfiguration';
import { parseLicenseCheckConfiguration } from './parseLicenseCheckConfiguration';
import path from 'path';
import { error, Result, value } from 'defekt';
import * as errors from '../../errors';

const getLicenseCheckConfiguration = async function ({ absoluteDirectory }: {
  absoluteDirectory: string;
}): Promise<Result<
  LicenseCheckConfiguration,
  errors.LicenseCheckConfigurationNotFound | errors.LicenseCheckConfigurationMalformed
  >> {
  const absoluteLicenseCheckConfigurationFile = path.join(absoluteDirectory, 'licenseCheck.json');

  let licenseCheckConfigurationContent: string;

  try {
    licenseCheckConfigurationContent = await fs.promises.readFile(
      absoluteLicenseCheckConfigurationFile,
      'utf-8'
    );
  } catch (ex: unknown) {
    return error(new errors.LicenseCheckConfigurationNotFound({ cause: ex }));
  }

  let licenseCheckConfigurationObject: JsonObject;

  try {
    licenseCheckConfigurationObject = JSON.parse(licenseCheckConfigurationContent);
  } catch (ex: unknown) {
    return error(new errors.LicenseCheckConfigurationMalformed({
      message: (ex as Error).message,
      cause: ex
    }));
  }

  const licenseCheckConfigurationResult = parseLicenseCheckConfiguration(licenseCheckConfigurationObject);

  if (licenseCheckConfigurationResult.hasError()) {
    return error(new errors.LicenseCheckConfigurationMalformed({
      cause: licenseCheckConfigurationResult.error
    }));
  }

  return value(licenseCheckConfigurationResult.value);
};

export {
  getLicenseCheckConfiguration
};

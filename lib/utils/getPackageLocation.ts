import fs from 'fs/promises';
import { getPackageRoot } from './getPackageRoot';
import module from 'module';
import path from 'path';
import { error, Result, value } from 'defekt';
import * as errors from '../errors';

const getPackageLocation = async function ({ packageName, applicationRoot }: {
  packageName: string;
  applicationRoot: string;
}): Promise<Result<string, errors.PackageNotFound>> {
  const require = module.createRequire(`${applicationRoot}/`);

  try {
    const packagePath = require.resolve(packageName);
    const packageStat = await fs.stat(packagePath);
    const packageRootResult = await getPackageRoot({
      directory: packageStat.isDirectory() ? packagePath : path.dirname(packagePath)
    });

    if (packageRootResult.hasError()) {
      return error(new errors.PackageNotFound({
        message: 'Could not find the requested package.',
        data: { packageName, applicationRoot },
        cause: packageRootResult.error
      }));
    }

    return value(packageRootResult.value);
  } catch {
    return error(new errors.PackageNotFound({
      message: 'Could not find the requested package.',
      data: { packageName, applicationRoot }
    }));
  }
};

export {
  getPackageLocation
};

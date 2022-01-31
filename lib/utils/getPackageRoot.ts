import fs from 'fs';
import path from 'path';
import { error, Result, value } from 'defekt';
import * as errors from '../errors';

const isErrnoException = function (err: unknown): err is NodeJS.ErrnoException {
  return typeof err === 'object' && err !== null && 'code' in err;
};

const getPackageRoot = async function ({ directory }: {
  directory: string;
}): Promise<Result<string, errors.DirectoryNotFound | errors.ApplicationNotFound>> {
  try {
    await fs.promises.access(directory, fs.constants.R_OK);
  } catch (ex: unknown) {
    if (isErrnoException(ex) && ex.code === 'ENOENT') {
      return error(new errors.DirectoryNotFound());
    }

    throw ex;
  }

  const packageJsonPath = path.join(directory, 'package.json');

  try {
    await fs.promises.access(packageJsonPath, fs.constants.R_OK);
  } catch (ex: unknown) {
    if (isErrnoException(ex) && ex.code === 'ENOENT') {
      const upperDirectory = path.join(directory, '..');

      if (upperDirectory === directory) {
        return error(new errors.ApplicationNotFound());
      }

      return await getPackageRoot({ directory: upperDirectory });
    }

    throw ex;
  }

  return value(directory);
};

export { getPackageRoot };

import fs from 'fs';
import { PackageJson } from 'type-fest';
import path from 'path';
import { error, isError, Result, value } from 'defekt';
import * as errors from '../errors';

const getPackageJson = async function ({ absoluteDirectory }: {
  absoluteDirectory: string;
}): Promise<Result<PackageJson, errors.PackageJsonMissing | errors.PackageJsonMalformed>> {
  let packageJsonContent: string;

  try {
    packageJsonContent = await fs.promises.readFile(path.join(absoluteDirectory, 'package.json'), 'utf-8');
  } catch (ex: unknown) {
    if (!isError(ex)) {
      throw new errors.OperationInvalid();
    }

    return error(new errors.PackageJsonMissing({ cause: ex }));
  }

  try {
    const packageJson: PackageJson = JSON.parse(packageJsonContent);

    return value(packageJson);
  } catch (ex: unknown) {
    if (!isError(ex)) {
      throw new errors.OperationInvalid();
    }

    return error(new errors.PackageJsonMalformed({ cause: ex }));
  }
};

export {
  getPackageJson
};

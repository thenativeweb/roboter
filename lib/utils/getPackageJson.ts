import fs from 'fs';
import { PackageJson } from 'type-fest';
import path from 'path';
import { error, Result, value } from 'defekt';
import * as errors from '../errors';

const getPackageJson = async function ({ absoluteDirectory }: {
  absoluteDirectory: string;
}): Promise<Result<PackageJson, errors.PackageJsonMissing | errors.PackageJsonMalformed>> {
  let packageJsonContent: string;

  try {
    packageJsonContent = await fs.promises.readFile(path.join(absoluteDirectory, 'package.json'), 'utf-8');
  } catch (ex: unknown) {
    return error(new errors.PackageJsonMissing({ cause: ex as Error }));
  }

  try {
    const packageJson: PackageJson = JSON.parse(packageJsonContent);

    return value(packageJson);
  } catch (ex: unknown) {
    return error(new errors.PackageJsonMalformed({ cause: ex as Error }));
  }
};

export {
  getPackageJson
};

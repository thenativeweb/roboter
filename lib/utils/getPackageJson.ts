import fs from 'fs';
import { PackageJson } from 'type-fest';
import path from 'path';
import { error, Result, value } from 'defekt';
import * as errors from '../errors';

const getPackageJson = async function ({ applicationRoot }: {
  applicationRoot: string;
}): Promise<Result<PackageJson, errors.PackageJsonMissing>> {
  try {
    const packageJsonContent = await fs.promises.readFile(path.join(applicationRoot, 'package.json'), 'utf-8');
    const packageJson: PackageJson = JSON.parse(packageJsonContent);

    return value(packageJson);
  } catch (ex: unknown) {
    return error(new errors.PackageJsonMissing({ cause: ex }));
  }
};

export {
  getPackageJson
};

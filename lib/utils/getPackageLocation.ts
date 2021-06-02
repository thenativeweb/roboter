import { runCommand } from './runCommand';
import { error, Result, value } from 'defekt';
import * as errors from '../errors';

const getPackageLocation = async function ({ packageName, applicationRoot, version }: {
  packageName: string;
  applicationRoot: string;
  version?: string;
}): Promise<Result<string, errors.PackageNotFound>> {
  const packageIdentifier = `${packageName}${version ? `@${version}` : ''}`;

  const npmLsOutputResult = await runCommand(
    `npm ls '${packageIdentifier}' -p`,
    {
      cwd: applicationRoot,
      silent: true
    }
  );

  if (npmLsOutputResult.hasError()) {
    return error(new errors.PackageNotFound({
      message: 'Could not find the requested package.',
      data: { packageName, applicationRoot }
    }));
  }

  const absolutePackageDirectory = npmLsOutputResult.value.stdout.trim();

  return value(absolutePackageDirectory);
};

export {
  getPackageLocation
};

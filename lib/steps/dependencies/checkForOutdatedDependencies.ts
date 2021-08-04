import { runCommand } from '../../utils/runCommand';
import { error, Result, value } from 'defekt';
import * as errors from '../../errors';

const checkForOutdatedDependencies = async function ({ applicationRoot }: {
  applicationRoot: string;
}): Promise<Result<undefined, errors.OutdatedDependencies>> {
  const runCommandResult = await runCommand('npm outdated', {
    cwd: applicationRoot
  });

  if (runCommandResult.hasError()) {
    if (/Package +Current +Wanted +Latest +Location/u.test(runCommandResult.error.stdout)) {
      return error(new errors.OutdatedDependencies());
    }

    throw runCommandResult.error;
  }

  return value();
};

export {
  checkForOutdatedDependencies
};

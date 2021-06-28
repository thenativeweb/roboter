import { buntstift } from 'buntstift';
import { checkForOutdatedDependencies } from '../steps/dependencies/checkForOutdatedDependencies';
import { checkForUnusedDependencies } from '../steps/dependencies/checkForUnusedDependencies';
import { findNonStrictDependencies } from '../steps/dependencies/findNonStrictDependencies';
import { error, Result, value } from 'defekt';
import * as errors from '../errors';

const dependencyCheckTask = async function ({ applicationRoot }: {
  applicationRoot: string;
}): Promise<Result<undefined, errors.DependencyCheckFailed>> {
  buntstift.line();
  buntstift.info('Running dependency check...', { prefix: '▸' });

  buntstift.line();
  buntstift.info('Running unused or missing dependencies check...', { prefix: '▸' });
  const unusedDependencyCheckResult = await checkForUnusedDependencies({ applicationRoot });

  if (unusedDependencyCheckResult.hasError()) {
    buntstift.info(unusedDependencyCheckResult.error.message);

    return value();
  }

  buntstift.line();
  buntstift.info('Running strict dependencies check...', { prefix: '▸' });
  const nonStrictDependencies = await findNonStrictDependencies({ applicationRoot });

  if (nonStrictDependencies.length > 0) {
    buntstift.warn('Non-strict dependencies found.');
    buntstift.table(nonStrictDependencies as any);

    return error(new errors.DependencyCheckFailed({
      message: 'Non-strict dependency found.',
      cause: new errors.NonStrictDependencyFound()
    }));
  }

  buntstift.line();
  buntstift.info('Running outdated dependencies check...', { prefix: '▸' });
  const outdatedDependencyCheckResult = await checkForOutdatedDependencies({ applicationRoot });

  if (outdatedDependencyCheckResult.hasError()) {
    buntstift.info(outdatedDependencyCheckResult.error.message);

    return value();
  }

  buntstift.line();
  buntstift.success('Dependency check successful.');

  return value();
};

export {
  dependencyCheckTask
};

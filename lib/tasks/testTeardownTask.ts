import { buntstift } from 'buntstift';
import { fileExists } from '../utils/fileExists';
import path from 'path';
import { error, Result, value } from 'defekt';
import * as errors from '../errors';

const testTeardownTask = async function ({ applicationRoot }: {
  applicationRoot: string;
}): Promise<Result<undefined, errors.TestSetupFailed>> {
  buntstift.line();
  buntstift.info(`Running test teardown...`, { prefix: '▸' });

  const absoluteTestDirectory = path.join(applicationRoot, 'test');
  const doesTestDirectoryExist = await fileExists({
    absoluteFile: absoluteTestDirectory
  });

  if (!doesTestDirectoryExist) {
    buntstift.line();
    buntstift.warn('No test directory found, skipping test teardown.');

    return value();
  }

  const absolutePotentialSetupScriptFiles = [
    path.join(applicationRoot, 'test', 'teardown.ts'),
    path.join(applicationRoot, 'test', 'teardown.js')
  ];

  for (const absolutePotentialSetupScriptFile of absolutePotentialSetupScriptFiles) {
    if (await fileExists({ absoluteFile: absolutePotentialSetupScriptFile })) {
      const module = await import(absolutePotentialSetupScriptFile);
      let teardownFunction = module.default;

      if (teardownFunction.default) {
        teardownFunction = teardownFunction.default;
      }

      try {
        await teardownFunction();

        buntstift.line();
        buntstift.success('Test teardown successful.');

        return value();
      } catch (ex: unknown) {
        buntstift.error((ex as Error).stack!);
        buntstift.error('Failed to run test teardown.');

        return error(new errors.TestSetupFailed());
      }
    }
  }

  buntstift.line();
  buntstift.warn('No test teardown script found, skipping.');

  return value();
};

export {
  testTeardownTask
};

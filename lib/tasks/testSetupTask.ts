import { buntstift } from 'buntstift';
import { fileExists } from '../utils/fileExists';
import path from 'path';
import { error, Result, value } from 'defekt';
import * as errors from '../errors';

const testSetupTask = async function ({ applicationRoot }: {
  applicationRoot: string;
}): Promise<Result<undefined, errors.TestSetupFailed>> {
  buntstift.line();
  buntstift.info(`Running test setup...`, { prefix: '▸' });

  const absoluteTestDirectory = path.join(applicationRoot, 'test');
  const doesTestDirectoryExist = await fileExists({
    absoluteFile: absoluteTestDirectory
  });

  if (!doesTestDirectoryExist) {
    buntstift.line();
    buntstift.warn('No test directory found, skipping test setup.');

    return value();
  }

  const absolutePotentialSetupScriptFiles = [
    path.join(applicationRoot, 'test', 'setup.ts'),
    path.join(applicationRoot, 'test', 'setup.js')
  ];

  for (const absolutePotentialSetupScriptFile of absolutePotentialSetupScriptFiles) {
    if (await fileExists({ absoluteFile: absolutePotentialSetupScriptFile })) {
      const module = await import(absolutePotentialSetupScriptFile);
      let setupFunction = module.default;

      if (setupFunction.default) {
        setupFunction = setupFunction.default;
      }

      try {
        await setupFunction();

        buntstift.line();
        buntstift.success('Test setup successful.');

        return value();
      } catch (ex: unknown) {
        buntstift.error(`Error: ${(ex as Error).message}`);
        buntstift.error('Failed to run test setup.');

        return error(new errors.TestSetupFailed());
      }
    }
  }

  buntstift.line();
  buntstift.warn('No test setup script found, skipping.');

  return value();
};

export {
  testSetupTask
};

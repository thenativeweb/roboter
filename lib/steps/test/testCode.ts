import Mocha from 'mocha';
import { nodeenv } from 'nodeenv';
import { error, Result, value } from 'defekt';
import * as errors from '../../errors';

const testCode = async function ({ environmentVariables, absoluteMochaConfigurationFile, absoluteTestFiles }: {
  environmentVariables: NodeJS.ProcessEnv;
  absoluteMochaConfigurationFile?: string;
  absoluteTestFiles: string[];
}): Promise<Result<undefined, errors.TestsFailed>> {
  let additionalMochaConfiguration = {};

  if (absoluteMochaConfigurationFile) {
    additionalMochaConfiguration = (await import(absoluteMochaConfigurationFile)).default;
  }

  const mocha = new Mocha({
    asyncOnly: true,
    bail: true,
    color: true,
    reporter: 'spec',
    ui: 'tdd',
    ...additionalMochaConfiguration
  });

  for (const absoluteFile of absoluteTestFiles) {
    mocha.addFile(absoluteFile);
  }

  const resetEnvironment = nodeenv(environmentVariables);

  const runner = mocha.run();

  await new Promise<void>((resolve): void => {
    runner.on('end', (): void => resolve());
  });

  resetEnvironment();

  if (runner.failures > 0) {
    return error(new errors.TestsFailed());
  }

  return value();
};

export {
  testCode
};

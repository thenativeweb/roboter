import { buntstift } from 'buntstift';
import { compileTypeScript } from '../steps/build/compileTypeScript';
import { isTypeScript } from 'is-typescript';
import { error, Result, value } from 'defekt';
import * as errors from '../errors';

const buildTask = async function ({ applicationRoot }: {
  applicationRoot: string;
}): Promise<Result<undefined, errors.BuildFailed>> {
  buntstift.line();
  buntstift.info(`Running build...`, { prefix: '▸' });

  if (!await isTypeScript({ directory: applicationRoot })) {
    buntstift.warn('No TypeScript found, skipping build.');

    return value();
  }

  const compileResult = await compileTypeScript({ applicationRoot });

  if (compileResult.hasValue()) {
    buntstift.line();
    buntstift.success('Successfully built sources.');

    return value();
  }

  switch (compileResult.error.code) {
    case errors.TypeScriptCompilationFailed.code: {
      buntstift.error('TypeScript compilation failed.');

      return error(new errors.BuildFailed({
        message: compileResult.error.message,
        cause: compileResult.error
      }));
    }
    case errors.TypeScriptOutputConfigurationMissing.code: {
      buntstift.error('TypeScript compilation failed because no output directory is configured.');

      return error(new errors.BuildFailed({
        message: compileResult.error.message,
        cause: compileResult.error
      }));
    }
    default: {
      buntstift.error('Failed to build.');
      throw compileResult.error;
    }
  }
};

export {
  buildTask
};


import { compileTypeScript } from '../build/compileTypeScript';
import { Result } from 'defekt';
import * as errors from '../../errors';

const typeCheckCode = async function ({
  applicationRoot
}: {
  applicationRoot: string;
}): Promise<Result<
  undefined,
  errors.TypeScriptOutputConfigurationMissing | errors.TypeScriptCompilationFailed
  >> {
  return compileTypeScript({ applicationRoot, noEmit: true });
};

export {
  typeCheckCode
};

import { buntstift } from 'buntstift';
import fs from 'fs';
import { globby } from 'globby';
import path from 'path';
import { error, Result, value } from 'defekt';
import ts, { EmitResult } from 'typescript';
import * as errors from '../../errors';

const compileTypeScript = async function ({
  applicationRoot,
  noEmit
}: {
  applicationRoot: string;
  noEmit?: boolean;
}): Promise<Result<
  undefined,
  errors.TypeScriptOutputConfigurationMissing | errors.TypeScriptCompilationFailed
  >> {
  const tsconfigPath = path.join(applicationRoot, 'tsconfig.json');
  const tsconfig = (await import(`file://${tsconfigPath}`)).default;

  if (!tsconfig.compilerOptions || !tsconfig.compilerOptions.outDir) {
    return error(new errors.TypeScriptOutputConfigurationMissing());
  }

  const inputFiles = await globby(
    tsconfig.include ?? [],
    {
      absolute: false,
      cwd: applicationRoot,
      ignore: [
        ...tsconfig.exclude ?? [],
        'node_modules'
      ]
    }
  );
  const compilerOptions = ts.convertCompilerOptionsFromJson(
    tsconfig.compilerOptions,
    applicationRoot,
    tsconfigPath
  ).options;

  const program = ts.createProgram({
    rootNames: inputFiles,
    options: compilerOptions
  });

  if (tsconfig.compilerOptions.incremental !== true) {
    await fs.promises.rm(tsconfig.compilerOptions.outDir, { recursive: true, force: true });
  }

  let emitResult: EmitResult | undefined;
  const diagnostics = [ ...ts.getPreEmitDiagnostics(program) ];

  if (!noEmit) {
    emitResult = program.emit();
    diagnostics.push(...emitResult.diagnostics);
  }

  diagnostics.forEach((diagnostic): void => {
    if (diagnostic.file) {
      const { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start!);
      const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');

      buntstift.warn(`${diagnostic.file.fileName} (${line + 1},${character + 1}): error TS${diagnostic.code}: ${message}`);
    } else {
      buntstift.warn(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
    }
  });

  if (diagnostics.length > 0) {
    return error(new errors.TypeScriptCompilationFailed());
  }

  if (!noEmit && emitResult!.emitSkipped) {
    return error(new errors.TypeScriptCompilationFailed());
  }

  return value();
};

export {
  compileTypeScript
};

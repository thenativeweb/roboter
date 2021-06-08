import { buntstift } from 'buntstift';
import fs from 'fs';
import globby from 'globby';
import path from 'path';
import ts from 'typescript';
import { error, Result, value } from 'defekt';
import * as errors from '../../errors';

const compileTypeScript = async function ({ applicationRoot }: {
  applicationRoot: string;
}): Promise<Result<
  undefined,
  errors.TypeScriptOutputConfigurationMissing | errors.TypeScriptCompilationFailed
  >> {
  const tsconfigPath = path.join(applicationRoot, 'tsconfig.json');
  const tsconfig = (await import(tsconfigPath)).default;

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
    await fs.promises.rmdir(tsconfig.compilerOptions.outDir, { recursive: true });
  }

  const emitResult = program.emit();

  const allDiagnostics = [
    ...ts.getPreEmitDiagnostics(program),
    ...emitResult.diagnostics
  ];

  allDiagnostics.forEach((diagnostic): void => {
    if (diagnostic.file) {
      const { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start!);
      const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');

      buntstift.warn(`${diagnostic.file.fileName} (${line + 1},${character + 1}): error TS${diagnostic.code}: ${message}`);
    } else {
      buntstift.warn(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
    }
  });

  if (emitResult.emitSkipped || allDiagnostics.length > 0) {
    return error(new errors.TypeScriptCompilationFailed());
  }

  return value();
};

export {
  compileTypeScript
};

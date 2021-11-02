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
  const tsConfigPath = path.join(applicationRoot, 'tsconfig.json');
  const tsConfig = (await import(`file://${tsConfigPath}`)).default;

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const tsConfigSourceFile = ts.readJsonConfigFile(tsConfigPath, ts.sys.readFile);
  const parsedTsConfig = ts.parseJsonSourceFileConfigFileContent(tsConfigSourceFile, ts.sys, applicationRoot, undefined, tsConfigPath);
  const compilerOptions = parsedTsConfig.options;

  if (!compilerOptions.outDir) {
    return error(new errors.TypeScriptOutputConfigurationMissing());
  }

  const inputFiles = await globby(
    tsConfig.include ?? [],
    {
      absolute: false,
      cwd: applicationRoot,
      ignore: [
        ...tsConfig.exclude ?? [],
        'node_modules'
      ]
    }
  );

  const program = ts.createProgram({
    rootNames: inputFiles,
    options: compilerOptions
  });

  if (compilerOptions.incremental !== true) {
    await fs.promises.rm(compilerOptions.outDir, { recursive: true, force: true });
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

import { buntstift } from 'buntstift';
import { processenv } from 'processenv';
import shelljs from 'shelljs';
import { error, Result, value } from 'defekt';
import * as errors from '../errors.js';

const runCommand = async function (
  command: string,
  options: {
    cwd?: string;
    env?: NodeJS.ProcessEnv;
    maxBuffer?: number;
    silent?: boolean;
  } = {}
): Promise<Result<{ exitCode: number; stdout: string; stderr: string }, errors.ExecutableFailed>> {
  const cwd = options.cwd ?? process.cwd(),
        env = options.env ?? processenv() as NodeJS.ProcessEnv,
        maxBuffer = options.maxBuffer ?? 1_024 * 200,
        silent = options.silent ?? false;

  return new Promise((resolve, reject): void => {
    try {
      const childProcess = shelljs.exec(
        command,
        { cwd, env, maxBuffer, silent: true },
        (exitCode: number, stdout, stderr): void => {
          if (exitCode !== 0) {
            const ex = new errors.ExecutableFailed(
              stderr,
              command,
              exitCode,
              stdout,
              stderr
            );

            return resolve(error(ex));
          }

          resolve(value({ exitCode, stdout, stderr }));
        }
      );

      if (!silent) {
        childProcess.stdout?.on('data', (data): void => {
          buntstift.raw(`  ${data}`);
        });
        childProcess.stderr?.on('data', (data): void => {
          buntstift.raw(`  ${data}`, { target: 'stderr' });
        });
      }
    } catch (ex: unknown) {
      reject(ex);
    }
  });
};

export {
  runCommand
};

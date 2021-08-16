#!/usr/bin/env -S node --loader ts-node/esm --experimental-specifier-resolution=node --no-warnings

import { getHandlers } from '../cli/getHandlers';
import { rootCommand } from '../cli/rootCommand';
import { runCli } from 'command-line-interface';
import { buntstift, ColorLevel } from 'buntstift';

try {
  buntstift.configure(
    buntstift.
      getConfiguration().
      withColorLevel(ColorLevel.Ansi)
  );

  await runCli({
    rootCommand: rootCommand(),
    argv: process.argv,
    handlers: getHandlers()
  });

  process.exit(0);
} catch (ex: unknown) {
  buntstift.info((ex as Error).message);
  buntstift.error('An unexpected error occured.');

  process.exit(1);
}

#!/usr/bin/env -S node --loader ts-node/esm --experimental-specifier-resolution=node --no-warnings

import { buntstift } from 'buntstift';
import { getHandlers } from '../cli/getHandlers';
import { rootCommand } from '../cli/rootCommand';
import { runCli } from 'command-line-interface';

try {
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

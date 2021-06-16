#!/usr/bin/env -S node --loader ts-node/esm --experimental-specifier-resolution=node

import { buntstift } from 'buntstift';
import { getHandlers } from '../cli/getHandlers';
import { rootCommand } from '../cli/rootCommand';
import { runCli } from 'command-line-interface';

/* eslint-disable @typescript-eslint/no-floating-promises */
(async (): Promise<void> => {
  try {
    // TODO: remove this in Node 18 or something idk
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { emitWarning, argv } = process;

    process.emitWarning = (warning, name, ctor): void => {
      if (name === 'ExperimentalWarning') {
        return;
      }

      return emitWarning(warning, name, ctor);
    };

    await runCli({
      rootCommand: rootCommand(),
      argv,
      handlers: getHandlers()
    });
  } catch (ex: unknown) {
    buntstift.info((ex as Error).message);
    buntstift.error('An unexpected error occured.');

    process.exit(1);
  }
})();
/* eslint-enable @typescript-eslint/no-floating-promises */

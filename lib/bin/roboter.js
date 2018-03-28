#!/usr/bin/env node

'use strict';

require('babel-polyfill');

const path = require('path');

const buntstift = require('buntstift'),
      commandLineArgs = require('command-line-args'),
      commandLineCommands = require('command-line-commands'),
      findSuggestions = require('findsuggestions'),
      updateNotifier = require('update-notifier');

const commands = require('../cli/commands'),
      globalOptionDefinitions = require('../cli/globalOptionDefinitions'),
      packageJson = require('../../package.json'),
      shell = require('../shell/');

const defaultCommand = 'qa';

updateNotifier({ pkg: packageJson }).notify();

const exit = function (ex) {
  buntstift.line();

  if (!ex) {
    buntstift.exit(0);

    return;
  }

  if (ex.message) {
    buntstift.verbose(ex.message);
  }
  if (ex.stack) {
    buntstift.verbose(ex.stack);
  }
  buntstift.exit(1);
};

(async function () {
  const validCommands = Object.keys(commands);

  let parsed;

  const cwd = process.cwd();

  try {
    parsed = commandLineCommands([ null, ...validCommands ]);
  } catch (ex) {
    let packageJsonOfModule;

    try {
      /* eslint-disable global-require */
      packageJsonOfModule = require(path.join(cwd, 'package.json'));
      /* eslint-enable global-require */
    } catch (exPackageJson) {
      // Ignore error
    }

    if (packageJsonOfModule && packageJsonOfModule.scripts && packageJsonOfModule.scripts[ex.command]) {
      const args = process.argv.splice(3);

      try {
        await shell.execLive(`npm`, { args: [ 'run', ex.command, ...args ], cwd });
      } catch (exShellExecLive) {
        exit(exShellExecLive);
      }

      return;
    }

    const suggestions = findSuggestions({ for: ex.command, in: validCommands });

    buntstift.error(`Unknown command '${ex.command}', did you mean '${suggestions[0].suggestion}'?`);
    buntstift.exit(1);
  }

  if (!parsed.command) {
    if (parsed.argv.length > 0 && parsed.argv.includes('--version')) {
      buntstift.info(packageJson.version);
      buntstift.exit(0);
    }

    parsed.command = defaultCommand;
  }

  const command = commands[parsed.command];
  const validOptionDefinitions = [ ...globalOptionDefinitions, ...await command.getOptionDefinitions() ];

  const args = commandLineArgs(validOptionDefinitions, { argv: parsed.argv, partial: true });

  /* eslint-disable no-underscore-dangle */
  if (args._unknown && args._unknown.length > 0) {
    buntstift.error(`Unknown argument '${args._unknown[0]}'.`);
    buntstift.exit(1);
  }
  /* eslint-enable no-underscore-dangle */

  try {
    await command.run(args);
  } catch (ex) {
    exit(ex);
  }

  exit();
})();

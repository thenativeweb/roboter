#!/usr/bin/env node

'use strict';

require('@babel/polyfill');

const path = require('path');

const buntstift = require('buntstift'),
      commandLineArgs = require('command-line-args'),
      commandLineCommands = require('command-line-commands'),
      findSuggestions = require('findsuggestions'),
      updateNotifier = require('update-notifier');

const commands = require('../cli/commands'),
      errors = require('../errors'),
      globalOptionDefinitions = require('../cli/globalOptionDefinitions'),
      packageJson = require('../../package.json'),
      shell = require('../shell/'),
      ui = require('../cli/ui/');

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
  ui.progress.show();

  const validCommands = Object.keys(commands);

  let packageJsonOfModule,
      parsed;

  const cwd = process.cwd(),
        packageJsonPath = path.join(cwd, 'package.json');

  try {
    /* eslint-disable global-require */
    packageJsonOfModule = require(packageJsonPath);
    /* eslint-enable global-require */
  } catch (exPackageJson) {
    // Ignore error
  }

  try {
    parsed = commandLineCommands([ null, ...validCommands ]);
  } catch (ex) {
    if (packageJsonOfModule && packageJsonOfModule.scripts && packageJsonOfModule.scripts[ex.command]) {
      const args = process.argv.splice(3);

      try {
        await shell.execLive(`npm`, { args: [ 'run', ex.command, ...args ], cwd });
      } catch (exShellExecLive) {
        exit(exShellExecLive);
      }

      exit();
    }

    const suggestions = findSuggestions({ for: ex.command, in: validCommands });

    buntstift.error(`Unknown command '${ex.command}', did you mean '${suggestions[0].suggestion}'?`);
    buntstift.exit(1);
  }

  if (!parsed.command) {
    parsed.command = defaultCommand;

    if (parsed.argv.length > 0) {
      if (parsed.argv.includes('--version') || parsed.argv.includes('-v')) {
        buntstift.info(packageJson.version);
        buntstift.exit(0);
      }

      if (parsed.argv.includes('--help') || parsed.argv.includes('-h')) {
        parsed.command = 'help';
      }
    }
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
    if (!packageJsonOfModule && parsed.command !== 'help') {
      throw new errors.PackageJsonMissing();
    }

    await command.run(args);
  } catch (ex) {
    switch (ex.code) {
      case 'EPACKAGEJSONMISSING':
        ui.error('package.json is missing.');
        break;
      default:
    }

    exit(ex);
  }

  exit();
})();

#!/usr/bin/env node

'use strict';

const path = require('path');

const { buntstift } = require('buntstift'),
      commandLineArgs = require('command-line-args'),
      commandLineCommands = require('command-line-commands'),
      findSuggestions = require('findsuggestions'),
      { inlineLists } = require('common-tags');

const commands = require('../cli/commands'),
      errors = require('../errors'),
      globalOptionDefinitions = require('../cli/globalOptionDefinitions'),
      packageJson = require('../../package.json'),
      runCommand = require('../runCommand'),
      ui = require('../cli/ui');

const defaultCommand = 'qa';

const exit = function (ex) {
  buntstift.line();

  if (!ex) {
    process.exit(0);

    return;
  }

  if (ex.message) {
    buntstift.info(ex.message);
  }

  if (ex.stack) {
    buntstift.info(ex.stack);
  }

  process.exit(1);
};

(async function () {
  ui.progress.show();

  const validCommands = Object.keys(commands);

  let packageJsonOfModule,
      parsed;

  const cwd = process.cwd(),
        packageJsonPath = path.join(cwd, 'package.json');

  try {
    // eslint-disable-next-line global-require
    packageJsonOfModule = require(packageJsonPath);
  } catch {
    // Ignore error
  }

  try {
    parsed = commandLineCommands([ null, ...validCommands ]);
  } catch (ex) {
    if (packageJsonOfModule && packageJsonOfModule.scripts && packageJsonOfModule.scripts[ex.command]) {
      const args = process.argv.splice(3);

      try {
        await runCommand(inlineLists`npm run ${ex.command} ${args}`, { cwd });
      } catch (exRunCommand) {
        exit(exRunCommand);
      }

      exit();
    }

    const suggestions = findSuggestions({ for: ex.command, in: validCommands });

    buntstift.error(`Unknown command '${ex.command}', did you mean '${suggestions[0].suggestion}'?`);
    process.exit(1);
  }

  if (!parsed.command) {
    parsed.command = defaultCommand;

    if (parsed.argv.length > 0) {
      if (parsed.argv.includes('--version') || parsed.argv.includes('-v')) {
        buntstift.info(packageJson.version);
        process.exit(0);
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
    process.exit(1);
  }
  /* eslint-enable no-underscore-dangle */

  try {
    if (!packageJsonOfModule && parsed.command !== 'help') {
      throw new errors.PackageJsonMissing();
    }

    await command.run(args);
  } catch (ex) {
    if (ex.code === errors.PackageJsonMissing.code) {
      ui.error('package.json is missing.');
    }

    exit(ex);
  }

  exit();
})();

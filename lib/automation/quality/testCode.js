'use strict';

const path = require('path');

const flatten = require('lodash/flatten'),
      isTypeScript = require('is-typescript').default,
      oneLine = require('common-tags/lib/oneLine');

const errors = require('../../errors'),
      files = require('../../files'),
      runLifecycleStep = require('./runLifecycleStep'),
      shell = require('../../shell');

const testCode = async function ({ directory, printSuccess, type, ui }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }
  if (!ui) {
    throw new Error('UI is missing.');
  }

  ui.printTaskHeader('tests');

  const testDirectory = path.join(directory, 'test');
  const doesTestDirectoryExist = await files.exists({ path: testDirectory });

  if (!doesTestDirectoryExist) {
    ui.printTaskOmission('No test directory found, skipping tests.');

    return;
  }

  const ignoredDirectories = [ 'shared' ],
        preferredTypes = [ 'unit', 'integration', 'e2e', 'performance' ];
  let types = flatten([ type || await files.getSubDirectories({ directory: testDirectory }) ]);

  types = types.filter(currentType => !ignoredDirectories.includes(currentType));

  preferredTypes.reverse().forEach(preferredType => {
    const index = types.indexOf(preferredType);

    if (index !== -1) {
      types.splice(index, 1);
      types.unshift(preferredType);
    }
  });

  for (const currentType of types) {
    ui.printTaskHeader(`${currentType} tests`);

    const testFiles = await files.get({
      directory,
      pattern: `test/${currentType}/**/*Tests.(j|t)s`
    });

    const mochaOptsPath = path.join(testDirectory, currentType, 'mocha.opts');
    const hasMochaOpts = await files.exists({ path: mochaOptsPath });

    if (!testFiles || testFiles.length === 0) {
      throw new errors.TestsMissing();
    }

    await runLifecycleStep({
      directory: path.join(testDirectory, currentType),
      step: 'pre',
      ui
    });

    try {
      await shell.execLive(oneLine`
        npx mocha
          --async-only
          --bail
          --colors
          --exit
          --reporter spec
          ${isTypeScript({ directory }) ? '--require ts-node/register --require tsconfig-paths/register' : ''}
          --ui tdd
          ${hasMochaOpts ? `--opts ${mochaOptsPath}` : ''}
          ${testFiles.join(' ')}
      `, {
        cwd: directory,
        maxBuffer: 1000 * 1000 * 100
      });
    } catch {
      throw new errors.TestsFailed();
    } finally {
      await runLifecycleStep({
        directory: path.join(testDirectory, currentType),
        step: 'post',
        ui
      });
    }

    ui.printTaskSuccess(`${currentType} tests successful.`);
  }

  if (printSuccess) {
    ui.printTaskSuccess('Tests successful.');
  }
};

testCode.getFiles = async function ({ directory }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }

  const sourceFiles = await files.get({
    directory,
    pattern: [
      '**/*.js',
      '**/*.jsx',
      '**/*.ts',
      '**/*.tsx',
      '!**/node_modules/**/*',
      '!build/**/*',
      '!coverage/**/*',
      '!dist/**/*'
    ]
  });

  return sourceFiles;
};

module.exports = testCode;

'use strict';

const path = require('path');

const buntstift = require('buntstift'),
      flatten = require('lodash/flatten'),
      oneLine = require('common-tags/lib/oneLine');

const errors = require('../../errors'),
      files = require('../../files'),
      runLifecycleStep = require('./runLifecycleStep'),
      shell = require('../../shell');

const testCode = async function ({ directory, printSuccess, type }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }

  buntstift.line();
  buntstift.info(`Running tests...`, { prefix: '▸' });

  const testDirectory = path.join(directory, 'test');
  const doesTestDirectoryExist = await files.exists({ path: testDirectory });

  if (!doesTestDirectoryExist) {
    buntstift.line();
    buntstift.warn('No test directory found, skipping tests.');

    return;
  }

  const ignoredDirectories = [ 'shared' ],
        preferredTypes = [ 'units', 'integration', 'e2e' ];
  let types = flatten([ type || await files.getSubDirectories({ directory: testDirectory }) ]);

  types = types.filter(currentType => !ignoredDirectories.includes(currentType));

  preferredTypes.reverse().forEach(preferredType => {
    const index = types.indexOf(preferredType);

    if (index !== -1) {
      types.splice(index, 1);
      types.unshift(preferredType);
    }
  });

  for (let i = 0; i < types.length; i++) {
    const currentType = types[i];

    buntstift.line();
    buntstift.info(`Running tests of type ${currentType}...`, { prefix: '▸' });

    const testFiles = await files.get({
      directory,
      pattern: `test/${currentType}/**/*Tests.js`
    });

    const mochaOptsPath = path.join(testDirectory, currentType, 'mocha.opts');
    const hasMochaOpts = await files.exists({ path: mochaOptsPath });

    if (!testFiles || testFiles.length === 0) {
      throw new errors.TestsMissing();
    }

    await runLifecycleStep({ directory: path.join(testDirectory, currentType), step: 'pre' });

    try {
      await shell.execLive(oneLine`
        npx mocha
          --async-only
          --bail
          --colors
          --exit
          --reporter spec
          --ui tdd
          ${(hasMochaOpts ? `--opts ${mochaOptsPath}` : '')}
          ${testFiles.join(' ')}
      `, {
        cwd: directory,
        maxBuffer: 1000 * 1000 * 100
      });
    } catch (ex) {
      throw new errors.TestsFailed();
    } finally {
      await runLifecycleStep({ directory: path.join(testDirectory, currentType), step: 'post' });
    }

    buntstift.success(`Tests of type ${currentType} successful.`);
  }

  if (printSuccess) {
    buntstift.line();
    buntstift.success('Tests successful.');
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
      '!node_modules/**/*.js',
      '!coverage/**/*.js',
      '!dist/**/*.js'
    ]
  });

  return sourceFiles;
};

module.exports = testCode;

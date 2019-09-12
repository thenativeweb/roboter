'use strict';

const path = require('path');

const isTypeScript = require('is-typescript').default,
      { oneLineInlineLists } = require('common-tags'),
      processenv = require('processenv').default;

const errors = require('../../errors'),
      files = require('../../files'),
      runCommand = require('../../runCommand');

const testCode = async function ({ environmentVariables, directory, testFiles, type }) {
  if (!environmentVariables) {
    throw new Error('Environment variables are missing.');
  }
  if (!directory) {
    throw new Error('Directory is missing.');
  }
  if (!testFiles) {
    throw new Error('Test files are missing.');
  }
  if (!type) {
    throw new Error('Type is missing.');
  }

  const mochaOptsPath = path.join(directory, 'test', type, 'mocha.opts');
  const hasMochaOpts = await files.exists({ path: mochaOptsPath });

  try {
    await runCommand(oneLineInlineLists`
        npx mocha
          --async-only
          --bail
          --colors
          --exit
          --reporter spec
          ${await isTypeScript({ directory }) ? '--require ts-node/register --require tsconfig-paths/register' : ''}
          --ui tdd
          ${hasMochaOpts ? `--opts ${mochaOptsPath}` : ''}
          ${testFiles}
      `, {
      cwd: directory,
      maxBuffer: 1000 * 1000 * 100,
      env: {
        ...processenv(),
        ...environmentVariables
      }
    });
  } catch {
    throw new errors.TestsFailed();
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

'use strict';

const path = require('path');

const asyncAF = require('async-af'),
      { isTypeScript } = require('is-typescript'),
      { oneLineInlineLists } = require('common-tags'),
      { processenv } = require('processenv');

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

  const mochaConfigurationPath = path.join(directory, 'test', type, '.mocharc.json');
  const hasMochaConfigurationFile = await files.exists({ path: mochaConfigurationPath });

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
          ${hasMochaConfigurationFile ? `--config ${mochaConfigurationPath}` : ''}
          ${await asyncAF(testFiles).filterAF(async testFile => (await files.get({ directory, pattern: testFile })).length > 0).mapAF(globPattern => `'${globPattern}'`)}
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

module.exports = testCode;

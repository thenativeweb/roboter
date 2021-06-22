'use strict';

const fs = require('fs');
const path = require('path');

const exitCode = 0;

const subCommand = 'test --watch --no-bail';

const stdout = [
  'Running unit tests...',
  'unit tests successful.',
  'Running unit tests...',
  'unit tests failed.',
  'Quitting...'
];

const stderr = '';

const whileTheCommandIsRunning = async function ({ childProcess, absoluteTestDirectory }) {
  let stdoutAccumulator = '';
  let stderrAccumulator = '';

  childProcess.stdout.on('data', (chunk) => {
    stdoutAccumulator += chunk;
  });
  childProcess.stderr.on('data', (chunk) => {
    stdoutAccumulator += chunk;
  });

  await new Promise((resolve) => {
    const resolveWhenTestsSucceed = () => {
      if (stdoutAccumulator.includes('unit tests successful')) {
        childProcess.stdout.off('data', resolveWhenTestsSucceed);
        resolve();
      }
    }

    childProcess.stdout.on('data', resolveWhenTestsSucceed);
  });

  await fs.promises.writeFile(
    path.join(absoluteTestDirectory, 'lib', 'lib.js'),
    'const number = 7;\n\nmodule.exports = number;',
    'utf-8'
  );

  await new Promise((resolve) => {
    const resolveWhenTestsFail = () => {
      if (stderrAccumulator.includes('unit tests failed')) {
        childProcess.stderr.off('data', resolveWhenTestsFail);
        resolve();
      }
    }

    childProcess.stderr.on('data', resolveWhenTestsFail);
  });

  childProcess.kill();
};

module.exports = { exitCode, stdout, stderr, subCommand, whileTheCommandIsRunning };

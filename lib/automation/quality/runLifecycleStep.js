'use strict';

const path = require('path');

const buntstift = require('buntstift');

const files = require('../../files');

const runLifecycleStep = async function ({ directory, step }) {
  if (!directory) {
    throw new Error('Directory is misssing.');
  }
  if (!step) {
    throw new Error('Step is misssing.');
  }

  const file = path.join(directory, `${step}.js`);

  if (!await files.exists({ path: file })) {
    return;
  }

  buntstift.line();
  buntstift.info(`Running ${step} step...`, { prefix: '▸' });

  /* eslint-disable global-require */
  const stepFunction = require(file);
  /* eslint-enable global-require */

  await stepFunction();

  buntstift.line();
};

module.exports = runLifecycleStep;

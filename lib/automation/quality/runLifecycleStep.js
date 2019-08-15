'use strict';

const path = require('path');

const files = require('../../files');

const runLifecycleStep = async function ({ directory, step, ui }) {
  if (!directory) {
    throw new Error('Directory is misssing.');
  }
  if (!step) {
    throw new Error('Step is misssing.');
  }
  if (!ui) {
    throw new Error('UI is misssing.');
  }

  // TODO: @Hannes ... we currently also do not support pre.ts and post.ts files
  //       in tests, but I think that we should do this.
  const file = path.join(directory, `${step}.js`);

  if (!await files.exists({ path: file })) {
    return;
  }

  ui.printTaskHeader(`${step} step`);

  /* eslint-disable global-require */
  const stepFunction = require(file);
  /* eslint-enable global-require */

  await stepFunction();
};

module.exports = runLifecycleStep;

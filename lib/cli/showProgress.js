'use strict';

const { buntstift } = require('buntstift');

const showProgress = function (verbose, stopWaiting) {
  if (verbose === undefined) {
    throw new Error('Verbose is missing.');
  }
  if (!stopWaiting) {
    throw new Error('Stop waiting is missing.');
  }

  let internalStopWaiting = stopWaiting;

  return function (progress) {
    if (!progress) {
      throw new Error('Progress is missing.');
    }
    if (!progress.message) {
      throw new Error('Message is missing.');
    }

    const type = progress.type || 'verbose';

    const spinnerRequiresPause = internalStopWaiting && (type !== 'verbose' || verbose);

    if (spinnerRequiresPause) {
      internalStopWaiting();
    }

    buntstift[type](progress.message.trim());

    if (spinnerRequiresPause) {
      internalStopWaiting = buntstift.wait();
    }
  };
};

module.exports = showProgress;

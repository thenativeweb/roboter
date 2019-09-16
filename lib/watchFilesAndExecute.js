'use strict';

const buntstift = require('buntstift').default,
      chokidar = require('chokidar');

const noop = require('./noop');

let isCurrentlyExecuting = false;

const watchFilesAndExecute = async function ({ message, files, execute, executeOnStart = false }) {
  if (!message) {
    throw new Error('Message is missing.');
  }
  if (!files) {
    throw new Error('Files are missing.');
  }
  if (!execute) {
    throw new Error('Execute is missing.');
  }

  buntstift.line();
  buntstift.info(message, { prefix: '▸' });

  const handleChange = function () {
    if (isCurrentlyExecuting) {
      return;
    }
    isCurrentlyExecuting = true;

    (async () => {
      try {
        await execute();
      } catch (ex) {
        // In watch mode, we ignore any errors (since we do not have an
        // exit code anyway).

        buntstift.verbose(ex.message);
      } finally {
        isCurrentlyExecuting = false;
      }
    })();
  };

  chokidar.watch(files, { ignoreInitial: true }).
    on('ready', () => {
      if (executeOnStart) {
        handleChange();
      }
    }).
    on('all', () => {
      buntstift.line();
      buntstift.warn('Changes detected, running again...', { prefix: '▸' });

      handleChange();
    });

  await new Promise(noop);
};

module.exports = watchFilesAndExecute;

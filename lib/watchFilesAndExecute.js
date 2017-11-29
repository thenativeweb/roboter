'use strict';

const buntstift = require('buntstift'),
      chokidar = require('chokidar');

const noop = require('./noop');

const watchFilesAndExecute = async function ({ message, files, execute }) {
  if (!message) {
    throw new Error('Message is missing.');
  }
  if (!files) {
    throw new Error('Files are missing.');
  }
  if (!execute) {
    throw new Error('Execute is missing.');
  }

  buntstift.info(message);

  chokidar.watch(files, { ignoreInitial: true }).
    on('all', () => {
      (async () => {
        buntstift.line();
        try {
          await execute();
        } catch (ex) {
          // In watch mode, we ignore any errors (since we do not have an
          // exit code anyway).

          buntstift.verbose(ex.message);
        }
      })();
    });

  await new Promise(noop);
};

module.exports = watchFilesAndExecute;

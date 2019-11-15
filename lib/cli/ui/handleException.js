'use strict';

const { buntstift } = require('buntstift');

const handleException = function (ex, messages) {
  if (!ex) {
    throw new Error('Exception is missing.');
  }
  if (!messages) {
    throw new Error('Messages are missing.');
  }

  let message = messages[ex.code];

  if (!message && messages.default) {
    message = messages.default;
  }

  buntstift.error(message);
};

module.exports = handleException;

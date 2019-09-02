'use strict';

const buntstift = require('buntstift').default;

const printTaskSuccess = function (message) {
  if (!message) {
    throw new Error('Message is missing.');
  }

  buntstift.line();
  buntstift.success(message);
};

module.exports = printTaskSuccess;

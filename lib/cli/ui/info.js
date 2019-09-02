'use strict';

const buntstift = require('buntstift').default;

const info = function (message) {
  if (!message) {
    throw new Error('Info is missing.');
  }

  buntstift.info(message);
};

module.exports = info;

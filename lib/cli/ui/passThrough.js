'use strict';

const buntstift = require('buntstift').default;

const passThrough = function (message, options) {
  if (!message) {
    throw new Error('Info is missing.');
  }

  buntstift.passThrough(message, options);
};

module.exports = passThrough;

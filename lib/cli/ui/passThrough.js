'use strict';

const { buntstift } = require('buntstift');

const passThrough = function (message, options) {
  if (!message) {
    throw new Error('Info is missing.');
  }

  buntstift.raw(message, options);
};

module.exports = passThrough;

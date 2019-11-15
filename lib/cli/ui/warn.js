'use strict';

const { buntstift } = require('buntstift');

const warn = function (warning) {
  if (!warning) {
    throw new Error('Warning is missing.');
  }

  buntstift.warn(warning);
};

module.exports = warn;

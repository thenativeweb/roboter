'use strict';

const buntstift = require('buntstift').default;

const error = function (err) {
  if (!err) {
    throw new Error('Error is missing.');
  }

  buntstift.error(err);
};

module.exports = error;

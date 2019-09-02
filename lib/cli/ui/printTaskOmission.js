'use strict';

const buntstift = require('buntstift').default;

const printTaskOmission = function (reason) {
  if (!reason) {
    throw new Error('Reason is missing.');
  }

  buntstift.line();
  buntstift.warn(reason);
};

module.exports = printTaskOmission;

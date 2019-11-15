'use strict';

const { buntstift } = require('buntstift');

const printTaskFailure = function (reason) {
  if (!reason) {
    throw new Error('Reason is missing.');
  }

  buntstift.error(reason);
};

module.exports = printTaskFailure;

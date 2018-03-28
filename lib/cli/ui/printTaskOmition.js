'use strict';

const buntstift = require('buntstift');

const printTaskOmition = function (reason) {
  if (!reason) {
    throw new Error('Reason is missing');
  }

  buntstift.line();
  buntstift.warn(reason, { prefix: '▸' });
};

module.exports = printTaskOmition;

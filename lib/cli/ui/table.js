'use strict';

const buntstift = require('buntstift');

const table = function (data) {
  if (!data) {
    throw new Error('Data is missing');
  }

  buntstift.table(data);
};

module.exports = table;

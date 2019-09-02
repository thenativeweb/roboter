'use strict';

const buntstift = require('buntstift').default;

const table = function (data) {
  if (!data) {
    throw new Error('Data is missing.');
  }

  buntstift.table(data);
};

module.exports = table;

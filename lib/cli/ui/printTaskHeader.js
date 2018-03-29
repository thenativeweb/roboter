'use strict';

const buntstift = require('buntstift');

const printTaskHeader = function (name) {
  if (!name) {
    throw new Error('Name is missing.');
  }

  buntstift.line();
  buntstift.info(`Running ${name}...`, { prefix: '▸' });
};

module.exports = printTaskHeader;

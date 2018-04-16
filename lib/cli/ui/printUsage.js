'use strict';

const buntstift = require('buntstift'),
      getUsage = require('command-line-usage');

const printUsage = function (usage) {
  buntstift.info(getUsage(usage));
};

module.exports = printUsage;

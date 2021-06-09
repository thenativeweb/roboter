'use strict';

const teardown = function () {
  throw new Error('Teardown failed.');
};

module.exports = teardown;

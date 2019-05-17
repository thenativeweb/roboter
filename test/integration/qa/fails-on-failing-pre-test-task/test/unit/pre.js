'use strict';

const pre = async function () {
  throw new Error('Something went wrong.');
};

module.exports = pre;

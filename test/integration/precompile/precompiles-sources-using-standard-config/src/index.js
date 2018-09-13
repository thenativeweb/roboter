'use strict';

const AnotherAsyncThing = require('./AnotherAsyncThing');

const AsyncThing = async function ({ timeout = 1000 }) {
  await new Promise(resolve => setTimeout(resolve, timeout));
};

module.exports = {
  AsyncThing,
  AnotherAsyncThing
};

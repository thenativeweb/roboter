'use strict';

const AnotherAsyncThing = async function () {
  await new Promise(resolve => setTimeout(resolve, 1000));
};

module.exports = AnotherAsyncThing;

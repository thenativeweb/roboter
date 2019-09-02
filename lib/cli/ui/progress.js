'use strict';

const buntstift = require('buntstift').default;

let stop;

const progress = {
  show () {
    stop = buntstift.wait();
  },
  hide () {
    if (stop) {
      stop();
    }
  }
};

module.exports = progress;

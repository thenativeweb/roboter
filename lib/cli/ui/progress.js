'use strict';

const { buntstift } = require('buntstift');

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

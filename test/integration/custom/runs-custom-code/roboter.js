'use strict';

const roboter = require('../../../../lib/roboter');

roboter.
  workOn('server').
  equipWith(task => {
    task('custom/custom', done => {
      console.log('foo');
      done();
    });
  }).
  start();

'use strict';

const roboter = require('../../../../lib/roboter');

roboter.
  workOn('server').
  equipWith(task => {
    task('universal/analyze', {
      src: [ 'app.js' ]
    });
  }).
  start();

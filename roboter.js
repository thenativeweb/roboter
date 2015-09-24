'use strict';

const roboter = require('./lib/roboter');

roboter.
  workOn('client').
  equipWith(task => {
    task('universal/analyze', () => ({
      src: [ '**/*.js', '!node_modules/**/*.js', '!**/build/**/*.js', '!test/bundle-scripts/src/app.js' ]
    }));
  }).start();

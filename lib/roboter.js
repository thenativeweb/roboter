'use strict';

const gulp = require('gulp'),
    runSequence = require('run-sequence');

const tasks = {};
let environment;

const use = function (name, getConfiguration) {
  const configuration = (typeof getConfiguration === 'function') ? getConfiguration() : null;

  tasks[name] = configuration;
};

const roboter = {
  workOn (env) {
    environment = env;
    return this;
  },

  equipWith (callback) {
    use('analyze');
    use('gitnobehind');
    use('outdated');

    if (environment === 'client') {
      use('client-scripts');
      use('client-themes');
    }

    callback(use);

    return this;
  },

  start () {
    Object.keys(tasks).forEach(function (taskName) {
      const task = require('./tasks/' + taskName);
      const taskConfiguration = tasks[taskName];

      task(taskConfiguration);
    });

    if (environment === 'client') {
      gulp.task('watch', [ 'client-scripts--watch', 'client-themes--watch' ]);

      gulp.task('build', function (done) {
        runSequence(
          [ 'analyze' ],
          [ 'client-scripts', 'client-themes' ],
          done);
      });
    }
  }
};

module.exports = roboter;

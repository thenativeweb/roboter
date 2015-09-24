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
      use('bundle-scripts');
      use('themes');
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
      gulp.task('watch-client', [ 'watch-bundle-scripts', 'watch-themes' ]);

      gulp.task('build-client', function (done) {
        runSequence(
          [ 'analyze' ],
          [ 'bundle-scripts', 'themes' ],
          done);
      });
    }

    // Turn private into public tasks.
    Object.keys(gulp.tasks).forEach(taskName => {
      if (taskName.startsWith('_')) {
        gulp.task(taskName.substring(1), [ taskName ]);
      }
    });

    // Register aliases for public tasks.
    gulp.task('analyse', [ 'analyze' ]);
  }
};

module.exports = roboter;

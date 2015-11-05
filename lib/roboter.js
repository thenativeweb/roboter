'use strict';

const fs = require('fs'),
    path = require('path');

const gulp = require('gulp');

const Roboter = function () {
  this.tasks = {};
  this.useFolder('universal');
  this.isWatching = false;
};

Roboter.prototype.use = function (taskName, configuration) {
  const taskNamePartials = taskName.split('/');

  configuration = configuration || {};

  this.tasks[taskName] = {
    name: taskName,
    configuration,
    directory: path.join(__dirname, 'tasks', taskNamePartials[0], taskNamePartials[1])
  };
};

Roboter.prototype.useFolder = function (environment) {
  const taskDirectories = fs.readdirSync(path.join(__dirname, 'tasks', environment));

  taskDirectories.forEach(taskDirectory => {
    this.use(`${environment}/${taskDirectory}`);
  });
};

Roboter.prototype.workOn = function (environment) {
  this.environment = environment;
  this.useFolder(this.environment);

  return this;
};

Roboter.prototype.equipWith = function (callback) {
  callback(this.use.bind(this));

  return this;
};

Roboter.prototype.start = function () {
  Object.keys(this.tasks).forEach(taskName => {
    const options = this.tasks[taskName];
    const task = require(options.directory);

    task(this, options.configuration);
  });

  // Turn private into public tasks.
  Object.keys(gulp.tasks).forEach(taskName => {
    if (taskName.startsWith('_')) {
      gulp.task(taskName.substring(1), [ taskName ]);
    }
  });

  // Register aliases for public tasks.
  gulp.task('analyse', [ 'analyze' ]);
  gulp.task('publish', [ 'release' ]);
  gulp.task('publish-force', [ 'release-force' ]);
  gulp.task('watch-analyse', [ 'watch-analyze' ]);

  // Register default task.
  gulp.task('default', [ `watch-${this.environment}` ]);

  gulp.on('stop', () => {
    if (this.isWatching) {
      return;
    }
    /* eslint-disable no-process-exit */
    process.exit();
    /* eslint-enable no-process-exit */
  });
};

module.exports = new Roboter();

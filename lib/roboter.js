'use strict';

const fs = require('fs'),
      path = require('path');

const gulp = require('gulp');

const Roboter = function () {
  this.tasks = {};
  this.useFolder('universal');
  this.isWatching = false;
};

Roboter.prototype.use = function (taskName, configuration, code) {
  const taskNamePartials = taskName.split('/');

  if (taskNamePartials[0] === 'custom') {
    if (!code) {
      code = configuration;
      configuration = [];
    }
    if (typeof code !== 'function') {
      throw new Error('Code is not a function.');
    }

    this.tasks[taskName] = {
      name: taskNamePartials[1],
      dependencies: configuration,
      code
    };

    return;
  }

  this.tasks[taskName] = {
    name: taskName,
    configuration: configuration || {},
    directory: path.join(__dirname, 'tasks', taskNamePartials[0], taskNamePartials[1])
  };
};

Roboter.prototype.useFolder = function (environment) {
  /* eslint-disable no-sync */
  const taskDirectories = fs.readdirSync(path.join(__dirname, 'tasks', environment));
  /* eslint-enable no-sync */

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
  Object.keys(this.tasks).
    filter(taskName => !taskName.startsWith('custom/')).
    forEach(taskName => {
      const options = this.tasks[taskName];

      /* eslint-disable global-require */
      const task = require(options.directory);
      /* eslint-enable global-require */

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
  switch (this.environment) {
    case 'client':
      gulp.task('default', [ 'watch-client' ]);
      break;
    case 'server':
      gulp.task('default', [ 'build-server' ]);
      break;
    default:
      throw new Error('Invalid operation.');
  }

  // Register custom tasks.
  Object.keys(this.tasks).
    filter(taskName => taskName.startsWith('custom/')).
    forEach(taskName => {
      const task = this.tasks[taskName];

      if (gulp.tasks[task.name]) {
        throw new Error('Can not overwrite built-in task.');
      }

      gulp.task(task.name, task.dependencies, task.code);
    });

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

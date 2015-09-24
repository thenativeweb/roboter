#!/usr/bin/env node

'use strict';

const fs = require('fs'),
    path = require('path');

const buntstift = require('buntstift'),
    gulp = require('gulp'),
    updateNotifier = require('update-notifier');

const packageJson = require('../package.json');

const gulpfile = path.join(process.cwd(), 'roboter.js');

const args = process.argv.slice(2);

updateNotifier({
  packageName: packageJson.name,
  packageVersion: packageJson.version
}).notify();

if (!fs.existsSync(gulpfile)) {
  buntstift.error('roboter.js is missing.');
  buntstift.exit(1);
}

require(gulpfile);

if (args.length === 0) {
  return gulp.start('analyze', function () {
    buntstift.exit();
  });

  // const result = shell.exec(`${gulp} --gulpfile ${gulpfile} --color true --tasks-simple`, { silent: true });
  //
  // const tasks = result.output.split('\n').filter(task => task && !task.startsWith('_')).sort();
  //
  // buntstift.success('The following tasks are availabe:');
  // tasks.forEach(task => {
  //   buntstift.list(task);
  // });
  //
  // process.exit(0);
}

gulp.on('task_start', e => {
  buntstift.info(`${e.task} started...`);
});

gulp.start(args[0], function (err) {
  if (err) {
    buntstift.error('Roboter sad.', { prefix: ':[' });
    buntstift.exit(1);
  }

  buntstift.success('Roboter happy.', { prefix: ':]' });
});

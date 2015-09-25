#!/usr/bin/env node

'use strict';

const fs = require('fs'),
    path = require('path');

const buntstift = require('buntstift'),
    semver = require('semver'),
    shell = require('shelljs'),
    updateNotifier = require('update-notifier');

const packageJson = require('../package.json');

updateNotifier({
  packageName: packageJson.name,
  packageVersion: packageJson.version
}).notify();

if (!fs.existsSync(path.join(process.cwd(), 'node_modules', 'roboter'))) {
  buntstift.error('roboter is not installed locally.');
  buntstift.newLine();
  buntstift.info('Please run the following command:');
  buntstift.newLine();
  buntstift.info('  npm install roboter --save-dev --save-exact');
  buntstift.exit(1);
}

const localRoboterPackageJson = require(path.join(process.cwd(), 'node_modules', 'roboter', 'package.json'));

if (semver.gt(localRoboterPackageJson.version, packageJson.version)) {
  buntstift.error('The roboter runner is too old.');
  buntstift.newLine();
  buntstift.info('Please run the following command:');
  buntstift.newLine();
  buntstift.info('  npm install -g roboter');
  buntstift.exit(1);
}

const gulp = path.join(process.cwd(), 'node_modules', '.bin', 'gulp');

if (!fs.existsSync(gulp)) {
  buntstift.error('gulp is not installed locally.');
  buntstift.newLine();
  buntstift.info('Please run the following command:');
  buntstift.newLine();
  buntstift.info('  npm install gulp --save-dev --save-exact');
  buntstift.exit(1);
}

const gulpfile = path.join(process.cwd(), 'roboter.js');

if (!fs.existsSync(gulpfile)) {
  buntstift.error('roboter.js is missing.');
  buntstift.exit(1);
}

const args = process.argv.slice(2);

if (args.length === 0) {
  const result = shell.exec(`${gulp} --gulpfile ${gulpfile} --color true --tasks-simple`, { silent: true });

  const tasks = result.output.split('\n').filter(task => task && !task.startsWith('_')).sort();

  buntstift.success('The following tasks are availabe:');
  tasks.forEach(task => {
    buntstift.list(task);
  });

  buntstift.exit(0);
}

buntstift.exit(shell.exec(`${gulp} --gulpfile ${gulpfile} --color true ${args.join(' ')}`).code);

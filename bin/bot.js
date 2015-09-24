#!/usr/bin/env node

'use strict';

const fs = require('fs'),
    path = require('path');

const buntstift = require('buntstift'),
    shell = require('shelljs'),
    updateNotifier = require('update-notifier');

const packageJson = require('../package.json');

const gulp = path.join(process.cwd(), 'node_modules', '.bin', 'gulp'),
    gulpfile = path.join(process.cwd(), 'roboter.js');

const args = process.argv.slice(2);

updateNotifier({
  packageName: packageJson.name,
  packageVersion: packageJson.version
}).notify();

if (!fs.existsSync(gulp)) {
  buntstift.error('roboter is not installed locally.');
  buntstift.newLine();
  buntstift.info('Please run the following command:');
  buntstift.newLine();
  buntstift.info('  npm install roboter --save-dev --save-exact');
  buntstift.exit(1);
}

if (!fs.existsSync(gulpfile)) {
  buntstift.error('roboter.js is missing.');
  buntstift.exit(1);
}

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

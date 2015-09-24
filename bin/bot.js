#!/usr/bin/env node

'use strict';

const fs = require('fs'),
    path = require('path'),
    updateNotifier = require('update-notifier');

const shell = require('shelljs');

const packageJson = require('../package.json');

const gulp = path.join(__dirname, '..', 'node_modules', '.bin', 'gulp'),
    gulpfile = path.join(process.cwd(), 'roboter.js');

const args = process.argv.slice(2).join(' ');

updateNotifier({
  packageName: packageJson.name,
  packageVersion: packageJson.version
}).notify();

/* eslint-disable no-process-exit */
if (!fs.existsSync(gulp)) {
  console.log('roboter is not installed locally. Please run the following command:');
  console.log();
  console.log('    npm install roboter --save-dev --save-exact');
  process.exit(1);
}

if (args.length === 0) {
  const result = shell.exec(`${gulp} --gulpfile ${gulpfile} --color true --tasks-simple`, { silent: true });

  const tasks = result.output.split('\n').filter(task => task && !task.startsWith('_')).sort().join('\n');

  /* eslint-disable no-console */
  console.log(tasks);
  /* eslint-enable no-console */

  process.exit(0);
}

process.exit(shell.exec(`${gulp} --gulpfile ${gulpfile} --color true ${args}`).code);
/* eslint-enable no-process-exit */

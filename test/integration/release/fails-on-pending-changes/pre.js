'use strict';

const shell = require('shelljs');

const pre = function (options, callback) {
  shell.exec('git init', { cwd: options.dirname });
  shell.exec('git add .', { cwd: options.dirname });

  callback();
};

module.exports = pre;

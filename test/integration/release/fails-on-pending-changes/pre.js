'use strict';

const shell = require('shelljs');

const pre = async function (options) {
  shell.exec('git init', { cwd: options.dirname });
  shell.exec('git add .', { cwd: options.dirname });
};

module.exports = pre;

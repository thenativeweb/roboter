'use strict';

const exitCode = 0;

const stdout = [
  `▸ Running unused or missing dependencies check...
─`,
  `▸ Running outdated dependencies check...
─`,
  'Dependency check successful.'
];

const stderr = ``;

module.exports = { exitCode, stdout, stderr };

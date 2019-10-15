'use strict';

const sourceFiles = [
  '**/*.js',
  '**/*.jsx',
  '**/*.ts',
  '**/*.tsx',
  '!**/node_modules/**/*',
  '!build/**/*',
  '!coverage/**/*',
  '!dist/**/*'
];

module.exports = sourceFiles;

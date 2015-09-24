'use strict';

const roboter = require('../lib/roboter');

roboter.
  workOn('client').
  equipWith(task => {
    task('universal/analyze', () => ({
      src: './bundle-scripts/src/**/*',
      rules: './.eslintrc'
    }));

    task('client/bundle-scripts', () => ({
      baseDir: './bundle-scripts/src/',
      entryFiles: 'app.js',
      buildDir: './bundle-scripts/build'
    }));

    task('client/themes', () => ({
      entryFiles: './themes/src/**/theme.scss',
      watch: './themes/src/**/*.scss',
      assets: [ './themes/src/**/*', '!**/*.scss' ],
      buildDir: './themes/build/'
    }));
  }).start();

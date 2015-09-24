'use strict';

const roboter = require('./lib/roboter');

roboter.
  workOn('client').
  equipWith(task => {
    task('analyze', () => ({
      src: './test/bundle-scripts/src/**/*'
    }));

    task('bundle-scripts', () => ({
      baseDir: './test/bundle-scripts/src/',
      entryFiles: 'app.js',
      buildDir: './test/bundle-scripts/build'
    }));

    task('themes', () => ({
      entryFiles: './test/themes/src/**/theme.scss',
      watch: './test/themes/src/**/*.scss',
      assets: [ './test/themes/src/**/*', '!**/*.scss' ],
      buildDir: './test/themes/build/'
    }));
  }).start();

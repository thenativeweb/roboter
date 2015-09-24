'use strict';

const roboter = require('./lib/roboter');

roboter.
  workOn('client').
  equipWith(task => {
    task('universal/analyze', () => ({
      src: './test/bundle-scripts/src/**/*'
    }));

    task('client/bundle-scripts', () => ({
      baseDir: './test/bundle-scripts/src/',
      entryFiles: 'app.js',
      buildDir: './test/bundle-scripts/build'
    }));

    task('client/themes', () => ({
      entryFiles: './test/themes/src/**/theme.scss',
      watch: './test/themes/src/**/*.scss',
      assets: [ './test/themes/src/**/*', '!**/*.scss' ],
      buildDir: './test/themes/build/'
    }));
  }).start();

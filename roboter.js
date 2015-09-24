'use strict';

const roboter = require('./lib/roboter');

roboter.
  workOn('client').
  equipWith(task => {
    task('analyze', () => ({
      src: './test/client-scripts/src/**/*'
    }));

    task('client-scripts', () => ({
      baseDir: './test/client-scripts/src/',
      entryFiles: 'app.js',
      buildDir: './test/client-scripts/build'
    }));

    task('client-themes', () => ({
      entryFiles: './test/client-themes/src/**/theme.scss',
      watch: './test/client-themes/src/**/*.scss',
      assets: [ './test/client-themes/src/**/*', '!**/*.scss' ],
      buildDir: './test/client-themes/build/'
    }));
  }).start();

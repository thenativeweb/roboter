'use strict';

const roboter = require('../lib/roboter');

roboter.
  workOn('client').
  equipWith(task => {
    task('universal/analyze', {
      src: './bundle-scripts/src/**/*',
      rules: './.eslintrc'
    });

    task('universal/test-units', {
      src: './test-units/**/*Tests.js',
      reporter: 'spec',
      asyncOnly: true,
      bail: true,
      ui: 'tdd'
    });

    task('client/serve-client', {
      baseDir: './serve-client/',
      watch: [ './serve-client/*.html', './serve-client/**/*.css', './serve-client/**/*.js' ],
      ghostMode: false,
      notify: false,
      open: false
    });

    task('client/build-html', {
      src: './build-html/src/**.html',
      watch: './build-html/src/**.html',
      buildDir: './build-html/build/'
    });

    task('client/bundle-scripts', {
      baseDir: './bundle-scripts/src/',
      entryFiles: 'app.js',
      buildDir: './bundle-scripts/build'
    });

    task('client/build-themes', {
      entryFiles: './build-themes/src/**/theme.scss',
      watch: './build-themes/src/**/*.scss',
      assets: [ './build-themes/src/**/*', '!**/*.scss' ],
      buildDir: './build-themes/build/'
    });
  }).start();

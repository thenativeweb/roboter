'use strict';

const gulp = require('gulp');

const browserSync = require('browser-sync').create();

const defaultConfiguration = {
  baseDir: './build/',
  watch: [ './build/*.html', './build/**/*.css', './build/**/*.js' ],
  ghostMode: false,
  notify: false,
  open: false,
  syncBlacklist: [ 'no-sync.html' ]
};

const serveClient = function (configuration) {
  configuration = configuration || defaultConfiguration;

  gulp.task('_serve-client', function (done) {
    browserSync.init({
      server: {
        baseDir: configuration.baseDir
      },
      ghostMode: configuration.ghostMode,
      notify: configuration.notify,
      open: configuration.open,
      snippetOptions: {
        blacklist: configuration.syncBlacklist || []
      }
    });

    gulp.watch(configuration.watch).on('change', browserSync.reload);

    done();
  });
};

module.exports = serveClient;

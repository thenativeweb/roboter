'use strict';

const _ = require('lodash'),
      gulp = require('gulp');

const browserSync = require('browser-sync').create();

const defaultConfiguration = {
  baseDir: './build/',
  watch: [ './build/**/*' ],
  ghostMode: false,
  notify: false,
  open: false,
  port: 3000,
  syncBlacklist: [ 'no-sync.html' ]
};

const serveClient = function (roboter, userConfiguration) {
  const configuration = _.assign({}, defaultConfiguration, userConfiguration);

  gulp.task('_serve-client', done => {
    roboter.isWatching = true;

    browserSync.init({
      server: {
        baseDir: configuration.baseDir
      },
      ghostMode: configuration.ghostMode,
      notify: configuration.notify,
      open: configuration.open,
      port: configuration.port,
      snippetOptions: {
        blacklist: configuration.syncBlacklist || []
      }
    });

    gulp.watch(configuration.watch).on('change', browserSync.reload);

    done();
  });
};

module.exports = serveClient;

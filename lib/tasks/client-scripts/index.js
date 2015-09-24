'use strict';

const babelify = require('babelify'),
    browserify = require('browserify'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    source = require('vinyl-source-stream'),
    watchify = require('watchify');

const clientScript = function (config) {
  const bundleJs = function (options) {
    let bundler, rebundle;

    /* eslint-disable no-inline-comments */
    bundler = browserify(config.entryFiles, {
      basedir: config.baseDir,
      debug: options.debug,
      cache: {}, // required for watchify
      packageCache: {}, // required for watchify
      fullPaths: options.watch // required to be true only for watchify
    });
    /* eslint-enable no-inline-comments */

    if (options.watch) {
      bundler = watchify(bundler);
    }
    bundler.transform(babelify);

    rebundle = function () {
      let stream = bundler.bundle();

      stream.on('error', function (error) {
        gutil.log(gutil.colors.red.bold('Browserify Error:'));
        gutil.log(error.message);
      });
      stream = stream.pipe(source('app.js'));
      return stream.pipe(gulp.dest(config.buildDir));
    };

    bundler.on('update', function () {
      gutil.log('Browserify is rebuilding…');
      rebundle();
    }).on('time', function (time) {
      gutil.log('Browserify finished rebuilding in ' + time / 1000 + ' seconds.');
    });

    return rebundle();
  };

  gulp.task('client-scripts', function () {
    return bundleJs({ watch: false, debug: false });
  });

  gulp.task('client-scripts--watch', [ 'client-scripts' ], function () {
    return bundleJs({ watch: true, debug: true });
  });
};

module.exports = clientScript;

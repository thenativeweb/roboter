'use strict';

const babelify = require('babelify'),
    browserify = require('browserify'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    source = require('vinyl-source-stream'),
    watchify = require('watchify');

const defaultConfiguration = {
  baseDir: './src/',
  entryFiles: 'app.js',
  buildDir: './build'
};

const bundleScripts = function (configuration) {
  configuration = configuration || defaultConfiguration;

  const bundleJs = function (options) {
    let bundler, rebundle;

    /* eslint-disable no-inline-comments */
    bundler = browserify(configuration.entryFiles, {
      basedir: configuration.baseDir,
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
      return stream.pipe(gulp.dest(configuration.buildDir));
    };

    bundler.on('update', function () {
      gutil.log('Browserify is rebuilding…');
      rebundle();
    }).on('time', function (time) {
      gutil.log('Browserify finished rebuilding in ' + time / 1000 + ' seconds.');
    });

    return rebundle();
  };

  gulp.task('_bundle-scripts', function () {
    return bundleJs({ watch: false, debug: false });
  });

  gulp.task('_watch-bundle-scripts', [ 'bundle-scripts' ], function () {
    return bundleJs({ watch: true, debug: true });
  });
};

module.exports = bundleScripts;

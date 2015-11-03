'use strict';

const _ = require('lodash'),
    babelify = require('babelify'),
    browserify = require('browserify'),
    envify = require('envify'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    source = require('vinyl-source-stream'),
    watchify = require('watchify');

const defaultConfiguration = {
  baseDir: './src/',
  entryFile: 'index.js',
  babel: {
    presets: []
  },
  buildDir: './build',
  outputFile: 'app.js'
};

const buildScripts = function (userConfiguration) {
  const configuration = _.assign({}, defaultConfiguration, userConfiguration);

  const bundleJs = function (options) {
    let bundler, rebundle;

    /* eslint-disable no-inline-comments */
    bundler = browserify(configuration.entryFile, {
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

    bundler.transform(babelify, { presets: configuration.babel.presets });
    bundler.transform(envify);

    rebundle = function () {
      let stream = bundler.bundle();

      stream.on('error', function (error) {
        gutil.log(gutil.colors.red.bold('Browserify Error:'));
        gutil.log(error.message);
      });

      stream = stream.pipe(source(configuration.outputFile));
      return stream.pipe(gulp.dest(configuration.buildDir));
    };

    bundler.on('update', function () {
      gutil.log('Browserify is rebuilding...');
      rebundle();
    }).on('time', function (time) {
      gutil.log(`Browserify finished rebuilding in ${time / 1000} seconds.`);
    });

    return rebundle();
  };

  gulp.task('_build-scripts', function () {
    return bundleJs({ watch: false, debug: false });
  });

  gulp.task('_watch-build-scripts', [ 'build-scripts' ], function () {
    return bundleJs({ watch: true, debug: true });
  });
};

module.exports = buildScripts;

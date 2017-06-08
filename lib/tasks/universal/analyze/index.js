'use strict';

const fs = require('fs'),
      stream = require('stream');

const _ = require('lodash'),
      async = require('async'),
      eslint = require('gulp-eslint'),
      gulp = require('gulp');

const PassThrough = stream.PassThrough;

const defaultConfiguration = {
  format: 'stylish',
  rules: 'eslint-config-es/2015/server',
  src: [ '**/*.js', '!coverage/**/*.js', '!node_modules/**/*.js' ]
};

const analyze = function (roboter, userConfiguration) {
  const configuration = _.assign({}, defaultConfiguration, userConfiguration);

  const formats = _.flatten([ configuration.format ]).map(format => {
    if (typeof format === 'string') {
      return { as: format };
    }

    return format;
  });

  gulp.task('_analyze', () => {
    const resultStream = new PassThrough({ objectMode: true });

    const eslintStream = gulp.
      src(configuration.src).
      pipe(eslint(configuration.rules));

    eslintStream.pipe(resultStream);

    async.each(formats, (format, done) => {
      let fileStream;

      if (!format.file) {
        fileStream = process.stdout;
      } else {
        fileStream = fs.createWriteStream(format.file);
      }

      const outputStream = eslintStream.
        pipe(eslint.format(format.as, fileStream));

      let unsubscribe;
      const onEnd = function () {
        unsubscribe();
        done();
      };
      const onError = function () {
        unsubscribe();
        done();
      };

      unsubscribe = function () {
        outputStream.removeListener('end', onEnd);
        outputStream.removeListener('error', onError);
      };

      outputStream.on('end', onEnd);
      outputStream.on('error', onError);
    }, () => {
      resultStream.resume();
    });

    resultStream.pipe(eslintStream.failAfterError());
    resultStream.pause();

    return resultStream;
  });

  gulp.task('_watch-analyze', [ 'analyze' ], () => {
    roboter.isWatching = true;
    gulp.watch(configuration.src, [ 'analyze' ]);
  });
};

module.exports = analyze;

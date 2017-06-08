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
      let fileStream,
          passThroughEnd;

      if (!format.file) {
        fileStream = process.stdout;
        passThroughEnd = false;
      } else {
        fileStream = fs.createWriteStream(format.file);
        passThroughEnd = true;
      }

      console.log('##### Formatting…', format)

      const outputStream = eslintStream.
        pipe(eslint.format(format.as, fileStream), { end: passThroughEnd });

      let unsubscribe;
      const onEnd = function () {
        console.log('##### onEnd', format);
        unsubscribe();
        done();
      };
      const onError = function () {
        console.log('##### onError', format);
        unsubscribe();
        done();
      };

      unsubscribe = function () {
        console.log('##### Unsubscribing…', format);
        outputStream.removeListener('end', onEnd);
        outputStream.removeListener('error', onError);
      };

      outputStream.on('end', onEnd);
      outputStream.on('error', onError);
    }, () => {
      console.log('##### Resuming result stream…');
      resultStream.resume();
    });

    const returnStream = resultStream.pipe(eslint.failAfterError());
    console.log('##### Pausing result stream…');
    resultStream.pause();

    return returnStream;
  });

  gulp.task('_watch-analyze', [ 'analyze' ], () => {
    roboter.isWatching = true;
    gulp.watch(configuration.src, [ 'analyze' ]);
  });
};

module.exports = analyze;

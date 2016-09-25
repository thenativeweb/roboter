'use strict';

const _ = require('lodash'),
      gulp = require('gulp');

const defaultConfiguration = {
  buildDir: './build',
  src: [],
  watch: []
};

const copyStatic = function (roboter, userConfiguration) {
  const configuration = _.assign({}, defaultConfiguration, userConfiguration);

  gulp.task('_copy-static', () => gulp.
    src(configuration.src).
    pipe(gulp.dest(configuration.buildDir)));

  gulp.task('_watch-copy-static', [ 'copy-static' ], () => {
    roboter.isWatching = true;
    gulp.watch(configuration.watch, [ 'copy-static' ]);
  });
};

module.exports = copyStatic;

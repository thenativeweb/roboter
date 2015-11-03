'use strict';

const _ = require('lodash'),
    gulp = require('gulp');

const defaultConfiguration = {
  src: [],
  watch: [],
  buildDir: './build'
};

const copyStatic = function (userConfiguration) {
  const configuration = _.assign({}, defaultConfiguration, userConfiguration);

  gulp.task('_copy-static', function () {
    return gulp.src(configuration.src).
                pipe(gulp.dest(configuration.buildDir));
  });

  gulp.task('_watch-copy-static', [ 'copy-static' ], function () {
    gulp.watch(configuration.watch, [ 'copy-static' ]);
  });
};

module.exports = copyStatic;

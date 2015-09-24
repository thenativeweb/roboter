'use strict';

const gulp = require('gulp');

const watchClient = function () {
  gulp.task('_watch-client', [ 'watch-bundle-scripts', 'watch-themes', 'serve' ]);
};

module.exports = watchClient;

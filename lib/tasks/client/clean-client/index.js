'use strict';

const _ = require('lodash'),
    del = require('del'),
    gulp = require('gulp');

const defaultConfiguration = {
  buildDir: './build/**/*'
};

const cleanClient = function (userConfiguration) {
  const configuration = _.assign({}, defaultConfiguration, userConfiguration);

  gulp.task('_clean-client', function () {
    return del([
      configuration.buildDir
    ]);
  });
};

module.exports = cleanClient;

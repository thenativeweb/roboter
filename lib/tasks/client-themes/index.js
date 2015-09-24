'use strict';

const autoprefixer = require('gulp-autoprefixer'),
    gulp = require('gulp'),
    minifyCSS = require('gulp-minify-css'),
    sass = require('gulp-sass');

const clientThemes = function (config) {
  if (!config) {
    config = {
      entryFiles: './src/themes/**/theme.scss',
      watch: './src/themes/**/*.scss',
      assets: [ './src/themes/**/*', '!**/*.scss' ],
      buildDir: './build/themes/'
    };
  }

  gulp.task('client-themes--assets', function () {
    return gulp.src(config.assets).
                pipe(gulp.dest(config.buildDir));
  });

  gulp.task('client-themes--sass', function () {
    return gulp.src(config.entryFiles).
                pipe(sass().on('error', sass.logError)).
                pipe(autoprefixer()).
                pipe(minifyCSS({
                  aggressiveMerging: false
                })).
                pipe(gulp.dest(config.buildDir));
  });

  gulp.task('client-themes--sass--watch', function () {
    gulp.watch(config.watch, [ 'client-themes--sass' ]);
  });

  gulp.task('client-themes', [ 'client-themes--assets', 'client-themes--sass' ]);

  gulp.task('client-themes--watch', [ 'client-themes--sass', 'client-themes--sass--watch' ]);
};

module.exports = clientThemes;

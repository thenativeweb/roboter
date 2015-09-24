'use strict';

const autoprefixer = require('gulp-autoprefixer'),
    gulp = require('gulp'),
    minifyCSS = require('gulp-minify-css'),
    sass = require('gulp-sass');

const themes = function (config) {
  if (!config) {
    config = {
      entryFiles: './src/themes/**/theme.scss',
      watch: './src/themes/**/*.scss',
      assets: [ './src/themes/**/*', '!**/*.scss' ],
      buildDir: './build/themes/'
    };
  }

  gulp.task('_themes-assets', function () {
    return gulp.src(config.assets).
                pipe(gulp.dest(config.buildDir));
  });

  gulp.task('_themes-sass', function () {
    return gulp.src(config.entryFiles).
                pipe(sass().on('error', sass.logError)).
                pipe(autoprefixer()).
                pipe(minifyCSS({
                  aggressiveMerging: false
                })).
                pipe(gulp.dest(config.buildDir));
  });

  gulp.task('_themes-sass-watch', function () {
    gulp.watch(config.watch, [ 'themes-sass' ]);
  });

  gulp.task('_themes', [ 'themes-assets', 'themes-sass' ]);
  gulp.task('_watch-themes', [ 'themes-sass', 'themes-sass-watch' ]);
};

module.exports = themes;

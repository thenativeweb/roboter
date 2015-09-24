'use strict';

const autoprefixer = require('gulp-autoprefixer'),
    gulp = require('gulp'),
    minifyCSS = require('gulp-minify-css'),
    sass = require('gulp-sass');

const defaultConfiguration = {
  entryFiles: './src/themes/**/theme.scss',
  watch: './src/themes/**/*.scss',
  assets: [ './src/themes/**/*', '!**/*.scss' ],
  buildDir: './build/themes/'
};

const themes = function (configuration) {
  configuration = configuration || defaultConfiguration;

  gulp.task('_themes-assets', function () {
    return gulp.src(configuration.assets).
                pipe(gulp.dest(configuration.buildDir));
  });

  gulp.task('_themes-sass', function () {
    return gulp.src(configuration.entryFiles).
                pipe(sass().on('error', sass.logError)).
                pipe(autoprefixer()).
                pipe(minifyCSS({
                  aggressiveMerging: false
                })).
                pipe(gulp.dest(configuration.buildDir));
  });

  gulp.task('_themes-sass-watch', function () {
    gulp.watch(configuration.watch, [ 'themes-sass' ]);
  });

  gulp.task('_themes', [ 'themes-assets', 'themes-sass' ]);
  gulp.task('_watch-themes', [ 'themes-sass', 'themes-sass-watch' ]);
};

module.exports = themes;

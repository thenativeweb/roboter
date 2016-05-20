'use strict';

const fs = require('fs'),
      path = require('path');

const _ = require('lodash'),
      autoprefixer = require('gulp-autoprefixer'),
      cleanCSS = require('gulp-clean-css'),
      gulp = require('gulp'),
      imagemin = require('gulp-imagemin'),
      inject = require('gulp-inject'),
      merge = require('merge-stream'),
      rename = require('gulp-rename'),
      sass = require('gulp-sass');

const defaultConfiguration = {
  baseDir: 'src/themes/',
  entryFiles: 'src/themes/**/theme.scss',
  watch: 'src/themes/**/*.scss',
  assets: [ 'src/themes/**/*', '!src/themes/**/*.scss' ],
  buildDir: 'build/themes/'
};

const getThemeFolders = function (baseDirectory) {
  /* eslint-disable no-sync */
  return fs.readdirSync(baseDirectory).filter(file =>
    fs.statSync(path.join(baseDirectory, file)).isDirectory()
  );
  /* eslint-enable no-sync */
};

const buildThemes = function (roboter, userConfiguration) {
  const configuration = _.assign({}, defaultConfiguration, userConfiguration);

  gulp.task('_build-themes-assets', () => gulp.
    src(configuration.assets).
    pipe(gulp.dest(configuration.buildDir)));

  gulp.task('_watch-build-themes-assets', [ 'build-themes-assets' ], () => {
    roboter.isWatching = true;
    gulp.watch(configuration.assets, [ 'build-themes-assets' ]);
  });

  gulp.task('_build-themes-icons', () => {
    const themeNames = getThemeFolders(configuration.baseDir);

    const iconTasks = themeNames.map(themeName => {
      const optimizedIcons = gulp.src(
        path.join(configuration.baseDir, themeName, 'icons', '**/*.svg'), { read: true }
      ).
        pipe(imagemin({
          svgoPlugins: [
            { cleanupIDs: false },
            { flattenOneLevel: false }
          ]
        }));

      return gulp.
        src(path.join(__dirname, 'icons.tpl.js')).
        pipe(inject(optimizedIcons, {
          starttag: '/* --inject:icons-- */',
          endtag: '/* --end:icons-- */',
          /* eslint-disable max-params */
          transform (filepath, file, index, length) {
            /* eslint-enable max-params */
            const key = path.basename(filepath, '.svg');
            const separator = index + 1 < length ? ',' : '';

            return `  '${key}': '${file.contents}'${separator}`;
          }
        })).
        pipe(rename('icons.js')).
        pipe(gulp.dest(path.join(configuration.buildDir, themeName)));
    });

    return merge(iconTasks);
  });

  gulp.task('_watch-build-themes-icons', [ 'build-themes-icons' ], () => {
    roboter.isWatching = true;
    gulp.watch(path.join(configuration.baseDir, '**/*.svg'), [ 'build-themes-icons' ]);
  });

  gulp.task('_build-themes-sass', () => gulp.
    src(configuration.entryFiles).
    pipe(sass().on('error', sass.logError)).
    pipe(autoprefixer()).
    pipe(cleanCSS({
      aggressiveMerging: false
    })).
    pipe(gulp.dest(configuration.buildDir)));

  gulp.task('_watch-build-themes-sass', [ 'build-themes-sass' ], () => {
    roboter.isWatching = true;
    gulp.watch(configuration.watch, [ 'build-themes-sass' ]);
  });

  gulp.task('_build-themes', [
    'build-themes-assets', 'build-themes-icons', 'build-themes-sass'
  ]);
  gulp.task('_watch-build-themes', [
    'watch-build-themes-assets', 'watch-build-themes-icons', 'watch-build-themes-sass'
  ]);
};

module.exports = buildThemes;

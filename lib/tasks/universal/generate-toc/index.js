'use strict';

const fs = require('fs'),
      path = require('path');

const gulp = require('gulp'),
      gutil = require('gulp-util'),
      markdownToc = require('markdown-toc');

const generateToc = function () {
  gulp.task('_generate-toc', done => {
    const readmeMd = path.join(process.cwd(), 'README.md');

    fs.readFile(readmeMd, 'utf8', (errReadFile, oldMarkdown) => {
      if (errReadFile) {
        return done(new gutil.PluginError(
          'generate-toc', 'Failed to read README.md.'));
      }

      const newMarkdown = markdownToc.insert(oldMarkdown);

      fs.writeFile(readmeMd, newMarkdown, 'utf8', errWriteFile => {
        if (errWriteFile) {
          return done(new gutil.PluginError(
            'generate-toc', 'Failed to write README.md.'));
        }
        done(null);
      });
    });
  });
};

module.exports = generateToc;

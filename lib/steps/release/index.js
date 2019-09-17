'use strict';

const bumpVersion = require('./bumpVersion'),
      generateTocForMarkdown = require('./generateTocForMarkdown'),
      git = require('./git');

module.exports = {
  bumpVersion,
  generateTocForMarkdown,
  git
};

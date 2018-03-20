'use strict';

const markdownToc = require('markdown-toc');

const file = require('../file');

const generateTocForMarkdown = async function ({ path }) {
  if (!path) {
    throw new Error('Path is missing.');
  }

  const oldMarkdown = await file.read(path);

  const newMarkdown = markdownToc.insert(oldMarkdown);

  await file.write(path, newMarkdown);
};

module.exports = generateTocForMarkdown;

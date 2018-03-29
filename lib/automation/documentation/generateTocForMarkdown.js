'use strict';

const markdownToc = require('markdown-toc');

const file = require('../../file');

const generateTocForMarkdown = async function ({ path, ui }) {
  if (!path) {
    throw new Error('Path is missing.');
  }
  if (!ui) {
    throw new Error('UI is missing.');
  }

  ui.printTaskHeader('README.md TOC generation');

  const oldMarkdown = await file.read(path);

  const newMarkdown = markdownToc.insert(oldMarkdown);

  await file.write(path, newMarkdown);
};

module.exports = generateTocForMarkdown;

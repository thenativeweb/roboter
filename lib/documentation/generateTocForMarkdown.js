'use strict';

const fs = require('fs');

const markdownToc = require('markdown-toc'),
      promisify = require('util.promisify');

const readFile = promisify(fs.readFile),
      writeFile = promisify(fs.writeFile);

const generateTocForMarkdown = async function ({ path }) {
  if (!path) {
    throw new Error('Path is missing.');
  }

  const oldMarkdown = await readFile(path, 'utf8');

  const newMarkdown = markdownToc.insert(oldMarkdown);

  await writeFile(path, newMarkdown, 'utf8');
};

module.exports = generateTocForMarkdown;

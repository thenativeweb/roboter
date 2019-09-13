'use strict';

const fs = require('fs').promises;

const remark = require('remark'),
      toc = require('remark-toc');

const generateTocForMarkdown = async function ({ path }) {
  if (!path) {
    throw new Error('Path is missing.');
  }

  const oldMarkdown = await fs.readFile(path, { encoding: 'utf8' });

  const newMarkdown = await remark().
    use(toc, { tight: true }).
    process(oldMarkdown);

  await fs.writeFile(path, newMarkdown, { encoding: 'utf8' });
};

module.exports = generateTocForMarkdown;

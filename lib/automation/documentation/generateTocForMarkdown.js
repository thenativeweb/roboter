'use strict';

const fs = require('fs').promises;

const remark = require('remark'),
      toc = require('remark-toc');

const generateTocForMarkdown = async function ({ path, ui }) {
  if (!path) {
    throw new Error('Path is missing.');
  }
  if (!ui) {
    throw new Error('UI is missing.');
  }

  ui.printTaskHeader('README.md TOC generation');

  const oldMarkdown = await fs.readFile(path, { encoding: 'utf8' });

  const newMarkdown = await new Promise((resolve, reject) => {
    remark().
      use(toc, { tight: true }).
      process(oldMarkdown, (err, markdown) => {
        if (err) {
          return reject(err);
        }

        resolve(String(markdown));
      });
  });

  await fs.writeFile(path, newMarkdown, { encoding: 'utf8' });
};

module.exports = generateTocForMarkdown;

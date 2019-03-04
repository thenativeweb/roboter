'use strict';

const remark = require('remark'),
      toc = require('remark-toc');

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

  await file.write(path, newMarkdown);
};

module.exports = generateTocForMarkdown;

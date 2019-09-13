'use strict';

const generateTocForMarkdownStep = require('../../steps/release/generateTocForMarkdown');

const processReadmeForReleaseTask = async function ({ path, ui }) {
  if (!path) {
    throw new Error('Path is missing.');
  }
  if (!ui) {
    throw new Error('UI is missing.');
  }

  try {
    ui.printTaskHeader('README.md TOC generation');

    await generateTocForMarkdownStep({ path });
  } catch (ex) {
    ui.printTaskFailure('Failed to process readme for release.');
    throw ex;
  }
};

module.exports = processReadmeForReleaseTask;

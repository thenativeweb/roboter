'use strict';

const helpers = require('../../../helpers');

const pre = async function (options) {
  const { dirname } = options;

  await helpers.createGitRepository({
    dirname
  });
};

module.exports = pre;

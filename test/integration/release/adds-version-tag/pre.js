'use strict';

const helpers = require('../../../helpers');

const pre = function (options, callback) {
  const { dirname } = options;

  helpers.createGitRepository({
    dirname
  }).
    then(() => callback(null)).
    catch(callback);
};

module.exports = pre;

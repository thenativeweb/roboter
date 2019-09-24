'use strict';

const checkForPendingChanges = require('./checkForPendingChanges'),
      checkIfLocalBranchIsBehindRemote = require('./checkIfLocalBranchIsBehindRemote'),
      checkIfOnBranch = require('./checkIfOnBranch'),
      commitChanges = require('./commitChanges'),
      getCurrentBranch = require('./getCurrentBranch'),
      push = require('./push'),
      tag = require('./tag');

module.exports = {
  checkForPendingChanges,
  checkIfLocalBranchIsBehindRemote,
  checkIfOnBranch,
  commitChanges,
  getCurrentBranch,
  push,
  tag
};

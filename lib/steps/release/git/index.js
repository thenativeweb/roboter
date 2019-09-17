'use strict';

const checkForPendingChanges = require('./checkForPendingChanges'),
      checkIfLocalMasterIsBehindRemote = require('./checkIfLocalMasterIsBehindRemote'),
      checkIfOnMaster = require('./checkIfOnMaster'),
      commitChanges = require('./commitChanges'),
      push = require('./push'),
      tag = require('./tag');

module.exports = {
  checkForPendingChanges,
  checkIfLocalMasterIsBehindRemote,
  checkIfOnMaster,
  commitChanges,
  push,
  tag
};

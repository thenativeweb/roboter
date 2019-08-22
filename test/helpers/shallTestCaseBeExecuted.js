'use strict';

const shallTestCaseBeExecuted = function ({ task, testCase, args }) {
  if (!task) {
    throw new Error('Task is missing.');
  }
  if (!testCase) {
    throw new Error('Test case is missing.');
  }

  if (!args) {
    return true;
  }

  if (`${task}/${testCase}` === args) {
    return true;
  }
  if (`${task}/` === `${args}/`) {
    return true;
  }

  return false;
};

module.exports = shallTestCaseBeExecuted;

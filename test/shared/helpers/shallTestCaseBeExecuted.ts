const shallTestCaseBeExecuted = function ({ task, testCase, args }: {
  task: string;
  testCase: string;
  // TODO: fix this shit
  args?: string | undefined;
}): boolean {
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

export {
  shallTestCaseBeExecuted
};

interface BaseTestScriptParameters {
  runNumber: number;
  isWatchModeActive: boolean;
  isBailActive: boolean;
}

interface TestPreScriptParameters extends BaseTestScriptParameters {
  previousRunResult?: 'success' | 'fail' | 'bail';
}

interface TestPostScriptParameters extends BaseTestScriptParameters {
  preScriptData?: object;
  currentRunResult: 'success' | 'fail' | 'bail';
}

type TestPreScript = (parameters: TestPreScriptParameters) => Promise<object | undefined> | object | undefined;
type TestPostScript = (parameters: TestPostScriptParameters) => Promise<void> | void;

export type {
  TestPostScript,
  TestPostScriptParameters,
  TestPreScript,
  TestPreScriptParameters
};

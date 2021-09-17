type TestWorkerMessage = {
  type: 'buntstift';
  buntstiftMethod: 'line' | 'info' | 'error' | 'raw' | 'success';
  value?: string;
} | {
  type: 'final-status';
  value: 'bail' | 'fail' | 'success';
};

export type {
  TestWorkerMessage
};

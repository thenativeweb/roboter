import external from '../../lib/external';

const pre = async function (): Promise<void> {
  /* eslint-disable no-console */
  console.log('Hello from pre task!');
  /* eslint-enable no-console */
  external();
};

export default pre;

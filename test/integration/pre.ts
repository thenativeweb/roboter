import { GlobalRoboterTestData } from '../shared/helpers/fixture/GlobalRoboterTestData';
import { prepareGlobalRoboterTestData } from '../shared/helpers/fixture/prepareGlobalRoboterTestData';
import { TestPreScript } from '../../lib';

const pre: TestPreScript = async function (): Promise<GlobalRoboterTestData> {
  console.log('Preparing global roboter test data...');

  return await prepareGlobalRoboterTestData();
};

export default pre;

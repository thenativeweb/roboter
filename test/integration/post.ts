import { buntstift } from 'buntstift';
import { cleanupGlobalRoboterTestData } from '../shared/helpers/fixture/cleanupGlobalRoboterTestData';
import { TestPostScript } from '../../lib';

const post: TestPostScript = async function ({ preScriptData }): Promise<void> {
  await cleanupGlobalRoboterTestData(preScriptData as any);

  buntstift.info('Done cleaning up global roboter test data.');
};

export default post;

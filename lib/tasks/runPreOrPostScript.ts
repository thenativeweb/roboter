import { buntstift } from 'buntstift';
import path from 'path';
import { runCommand } from '../utils/runCommand';

const runPreOrPostScript = async function ({ applicationRoot, task, phase }: {
  applicationRoot: string;
  task: string;
  phase: 'pre' | 'post';
}): Promise<void> {
  const packageJsonPath = path.join(applicationRoot, 'package.json');

  let packageJsonOfModule;

  try {
    // eslint-disable-next-line prefer-const
    packageJsonOfModule = (await import(packageJsonPath)).default;
  } catch {
    // Ignore error.
  }

  if (!packageJsonOfModule) {
    return;
  }
  if (!packageJsonOfModule.scripts) {
    return;
  }

  const command = `${phase}${task}`;

  if (!packageJsonOfModule.scripts[command]) {
    return;
  }

  buntstift.line();
  buntstift.info(`Running ${phase}${task}...`, { prefix: '▸' });

  await runCommand(`npm run ${command}`, { cwd: applicationRoot });

  buntstift.line();
  buntstift.success(`Ran '${phase}${task}' successfully.`);
};

export {
  runPreOrPostScript
};


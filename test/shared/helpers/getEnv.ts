import path from 'path';

const getEnv = async function ({ absoluteTestDirectory }: {
  absoluteTestDirectory: string;
}): Promise<NodeJS.ProcessEnv> {
  let env;

  try {
    env = await import(path.join(absoluteTestDirectory, 'env.js'));
  } catch {
    env = {};
  }

  return env;
};

export {
  getEnv
};

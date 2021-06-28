import path from 'path';

const getArgsList = async function ({ absoluteTestDirectory }: {
  absoluteTestDirectory: string;
}): Promise<string[]> {
  let args;

  try {
    args = (await import(path.join(absoluteTestDirectory, 'args.js'))).default;
  } catch {
    args = {};
  }

  let argsList = args;

  if (typeof argsList === 'object') {
    argsList = Object.entries(args).
      flatMap(([ argName, argValue ]): string[] => {
        if (typeof argValue === 'boolean') {
          return [ `--${argName}` ];
        }

        return [ `--${argName}`, `${argValue}` ];
      });
  }

  return argsList;
};

export {
  getArgsList
};

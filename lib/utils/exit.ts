const exit = function (code?: number): never {
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(code ?? 0);
};

export {
  exit
};

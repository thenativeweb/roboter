const add = function (left: number, right: number): number {
  return left + right;
};

const sum = add(23, 42);

const incorrect = add('left', 'right');

// eslint-disable-next-line no-console
console.log(sum, incorrect);

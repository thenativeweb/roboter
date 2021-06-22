import { error, Result, value } from 'defekt';
import * as errors from '../errors';

const dependenciesTask = function (): Result<undefined, errors.DependencyCheckFailed> {
  return value();
};

export {
  dependenciesTask
};

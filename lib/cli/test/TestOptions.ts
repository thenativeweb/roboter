import { RootOptions } from '../RootOptions';

interface TestOptions extends RootOptions {
  watch: boolean;
  'no-bail': boolean;
  type?: string;
  grep?: string;
}

export type {
  TestOptions
};

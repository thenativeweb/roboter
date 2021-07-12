import { TestPreScriptParameters } from 'roboter';

const pre = function ({ runNumber, isWatchModeActive, isBailActive, previousRunResult }: TestPreScriptParameters): any {
    console.log('foobar pre script', {
        runNumber,
        isWatchModeActive,
        isBailActive,
        previousRunResult
    });

    return { foo: 'foobar' };
};

export default pre;

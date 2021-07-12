import { TestPreScriptParameters } from 'roboter';

const pre = function ({ runNumber, isWatchModeActive, isBailActive, previousRunResult }: TestPreScriptParameters): any {
    console.log('baz pre script', {
        runNumber,
        isWatchModeActive,
        isBailActive,
        previousRunResult
    });

    return { foo: 'baz' };
};

export default pre;

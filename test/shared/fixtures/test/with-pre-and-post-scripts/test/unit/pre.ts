import { TestPreScriptParameters } from 'roboter';

const pre = function ({ runNumber, isWatchModeActive, isBailActive, previousRunResult }: TestPreScriptParameters): any {
    console.log('unit pre script', {
        runNumber,
        isWatchModeActive,
        isBailActive,
        previousRunResult
    });

    return { foo: 'unit' };
};

export default pre;

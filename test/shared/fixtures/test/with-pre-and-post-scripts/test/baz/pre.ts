import { TestPreScriptParameters } from 'roboter';

const pre = function ({ runNumber, isWatchModeActive, isBailActive, previousRunResult }: TestPreScriptParameters): any {
    console.log('baz pre script', JSON.stringify({
        runNumber,
        isWatchModeActive,
        isBailActive,
        previousRunResult
    }));

    return { baz: true };
};

export default pre;

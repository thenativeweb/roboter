import { TestPreScriptParameters } from 'roboter';

const pre = function ({ runNumber, isWatchModeActive, isBailActive, previousRunResult }: TestPreScriptParameters): any {
    console.log('foobar pre script', JSON.stringify({
        runNumber,
        isWatchModeActive,
        isBailActive,
        previousRunResult
    }));

    return { foobar: true };
};

export default pre;

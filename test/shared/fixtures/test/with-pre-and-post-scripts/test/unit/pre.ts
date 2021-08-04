import { TestPreScriptParameters } from 'roboter';

const pre = function ({ runNumber, isWatchModeActive, isBailActive, previousRunResult }: TestPreScriptParameters): any {
    console.log('unit pre script', JSON.stringify({
        runNumber,
        isWatchModeActive,
        isBailActive,
        previousRunResult
    }));

    return { unit: true };
};

export default pre;

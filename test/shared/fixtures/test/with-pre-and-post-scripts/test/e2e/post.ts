import { TestPostScriptParameters } from 'roboter';

const post = function ({ runNumber, isWatchModeActive, isBailActive, currentRunResult, preScriptData }: TestPostScriptParameters): void {
    console.log('e2e post script', JSON.stringify({
        runNumber,
        isWatchModeActive,
        isBailActive,
        currentRunResult,
        preScriptData
    }));
};

export default post;

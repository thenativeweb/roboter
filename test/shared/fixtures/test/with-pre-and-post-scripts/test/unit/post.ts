import { TestPostScriptParameters } from 'roboter';

const post = function ({ runNumber, isWatchModeActive, isBailActive, currentRunResult, preScriptData }: TestPostScriptParameters): void {
    console.log('unit post script', JSON.stringify({
        runNumber,
        isWatchModeActive,
        isBailActive,
        currentRunResult,
        preScriptData
    }));
};

export default post;

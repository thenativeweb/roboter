import { assert } from 'assertthat';
import { TestPreScriptParameters } from 'roboter';

const pre = function ({ runNumber, isWatchModeActive, isBailActive, previousRunResult }: TestPreScriptParameters): void {
    assert.that(runNumber).is.equalTo(0);
    assert.that(isWatchModeActive).is.false();
    assert.that(isBailActive).is.true();
    assert.that(previousRunResult).is.undefined()

    console.log('unit pre script successful');
};

export default pre;

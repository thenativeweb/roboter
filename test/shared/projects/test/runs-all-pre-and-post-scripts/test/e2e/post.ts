import { assert } from 'assertthat';
import { TestPostScriptParameters } from 'roboter';

const post = function ({ runNumber, isWatchModeActive, isBailActive, currentRunResult }: TestPostScriptParameters): void {
    assert.that(runNumber).is.equalTo(0);
    assert.that(isWatchModeActive).is.false();
    assert.that(isBailActive).is.true();
    assert.that(currentRunResult).is.equalTo('success');

    console.log('e2e post script successful');
};

export default post;

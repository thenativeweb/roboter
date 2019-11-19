'use strict';

const shell = require('shelljs');

shell.exec('git checkout -b some-branch');
shell.exec('touch blub');
shell.exec('git add blub');
shell.exec('git commit -m "blub"');
shell.exec('git push --set-upstream origin some-branch');

'use strict';

const path = require('path');

const shell = require('shelljs');

shell.mkdir('-p', path.join(__dirname, 'temp'));
shell.exec('echo "second file" > second.txt');
shell.exec('git add .');
shell.exec('git commit -m "Second commit."');
shell.exec('git push origin master');
shell.exec('git checkout master~');
shell.exec('git branch -f master master~');
shell.exec('git checkout master');

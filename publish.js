'use strict';

const fs = require('fs'),
      path = require('path');

const _ = require('lodash'),
      async = require('async'),
      buntstift = require('buntstift'),
      isolated = require('isolated'),
      shell = require('shelljs');

const base = require('./package.json'),
      client = require('./client.json'),
      server = require('./server.json');

async.eachSeries([ client, server ], (flavour, done) => {
  isolated((err, directory) => {
    if (err) {
      buntstift.error(err.message);
      buntstift.exit(1);
    }

    const newPackageJson = _.assign(base, flavour);

    Reflect.deleteProperty(newPackageJson, 'devDependencies');
    Reflect.deleteProperty(newPackageJson, 'main');
    Reflect.deleteProperty(newPackageJson, 'scripts');

    /* eslint-disable no-sync */
    fs.writeFileSync(path.join(directory, 'package.json'), JSON.stringify(newPackageJson));
    /* eslint-enable no-sync */

    shell.exec('npm publish', { cwd: directory }, done);
  });
}, err => {
  if (err) {
    buntstift.error(err.message);
    buntstift.exit(1);
  }

  buntstift.success('Successfully published sub-modules.');
  buntstift.exit(0);
});

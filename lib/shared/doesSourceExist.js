'use strict';

const fs = require('fs'),
    path = require('path');

const _ = require('lodash');

const doesSourceExist = function (source) {
  if (!source) {
    throw new Error('Source is missing.');
  }
    
  const sourceDirectories = _.flatten([ source ]);

  if (sourceDirectories.length === 0) {
    return false;
  }

  const exists = sourceDirectories.
    map(sd => sd.substr(0, sd.indexOf('*'))).
    map(sd => {
      try {
        fs.accessSync(path.join(process.cwd(), sd));
        return true;
      } catch (e) {
        return false;
      }
    });

  return _.some(exists);
};

module.exports = doesSourceExist;

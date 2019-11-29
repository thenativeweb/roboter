'use strict';

const analyseCommand = require('./analyse'),
      buildCommand = require('./build'),
      depsCommand = require('./deps'),
      helpCommand = require('./help'),
      licenseCommand = require('./license'),
      qaCommand = require('./qa'),
      testCommand = require('./test'),
      updateCommand = require('./update');

module.exports = {
  analyse: analyseCommand,
  build: buildCommand,
  deps: depsCommand,
  help: helpCommand,
  license: licenseCommand,
  qa: qaCommand,
  test: testCommand,
  update: updateCommand
};

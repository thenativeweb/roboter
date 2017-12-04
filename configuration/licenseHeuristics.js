'use strict';

const licenseHeuristics = {
  'Apache-2.0*': /Apache License, Version 2\.0/,
  'GPL-3.0*': /GNU GENERAL PUBLIC LICENSE\s*Version 3,/m,
  'MIT*': /MIT|The MIT License|ermission is hereby granted, free of charge, to any/
};

module.exports = licenseHeuristics;

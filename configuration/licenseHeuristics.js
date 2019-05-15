'use strict';

const licenseHeuristics = {
  'Apache-2.0*': /Apache License, Version 2\.0/u,
  'GPL-3.0*': /GNU GENERAL PUBLIC LICENSE\s*Version 3,/mu,
  'MIT*': /MIT|The MIT License|ermission is hereby granted, free of charge, to any/u
};

module.exports = licenseHeuristics;

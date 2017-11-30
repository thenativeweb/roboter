'use strict';

const licenseCompatibility = {
  'AGPL-3.0': [
    // Individual licenses
    'Apache-2.0', 'Apache-2.0*',
    'BSD-2-Clause', 'BSD-3-Clause',
    'ISC',
    'MIT', 'MIT/X11', 'MIT*',
    'MIT Licensed. http://www.opensource.org/licenses/mit-license.php',
    'Public Domain',
    'Unlicense',

    // Combined licenses
    '(Apache-2.0 OR MPL-1.1)',
    'BSD-3-Clause OR MIT',
    '(MIT AND CC-BY-3.0)',
    '(WTFPL OR MIT)'
  ]
};

module.exports = licenseCompatibility;

'use strict';

const licenseCompatibility = {
  MIT: [
    // Individual licenses
    'Apache-2.0', 'Apache-2.0*',
    'BSD-2-Clause', 'BSD-3-Clause',
    'CC-BY-4.0',
    'CC-BY-3.0',
    'CC0-1.0',
    'ISC',
    'LGPL-2.1+',
    'LGPL-3.0',
    'MIT', 'MIT/X11', 'MIT*',
    'MIT Licensed. http://www.opensource.org/licenses/mit-license.php',
    'Public Domain',
    'Unlicense',
    'WTFPL',

    // Combined licenses
    '(Apache-2.0 OR MPL-1.1)',
    '(BSD-2-Clause OR MIT OR Apache-2.0)',
    'BSD-3-Clause OR MIT',
    '(GPL-2.0 OR MIT)',
    '(MIT AND BSD-3-Clause)',
    '(MIT AND CC-BY-3.0)',
    '(MIT AND Zlib)',
    '(MIT OR Apache-2.0)',
    '(WTFPL OR MIT)'
  ],

  'AGPL-3.0': [
    // Individual licenses
    'Apache-2.0', 'Apache-2.0*',
    'BSD-2-Clause', 'BSD-3-Clause',
    'CC-BY-4.0',
    'CC-BY-3.0',
    'CC0-1.0',
    'ISC',
    'LGPL-2.1+',
    'LGPL-3.0',
    'MIT', 'MIT/X11', 'MIT*',
    'MIT Licensed. http://www.opensource.org/licenses/mit-license.php',
    'Public Domain',
    'Unlicense',
    'WTFPL',

    // Combined licenses
    '(Apache-2.0 OR MPL-1.1)',
    '(BSD-2-Clause OR MIT OR Apache-2.0)',
    'BSD-3-Clause OR MIT',
    '(GPL-2.0 OR MIT)',
    '(MIT AND BSD-3-Clause)',
    '(MIT AND CC-BY-3.0)',
    '(MIT AND Zlib)',
    '(MIT OR Apache-2.0)',
    '(WTFPL OR MIT)'
  ]
};

module.exports = licenseCompatibility;

'use strict';

const { TemplateTag } = require('common-tags');

const shellEscape = new TemplateTag({
  onSubstitution (substitution) {
    return substitution.replace(/['"$`\\]/gu, `\\$&`);
  }
});

module.exports = shellEscape;

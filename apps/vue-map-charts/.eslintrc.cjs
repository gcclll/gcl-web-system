/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  ...require('config/eslint-preset'),
  root: true
}

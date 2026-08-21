import sharedConfig from 'water-abstraction-engine/eslint.config.js'

export default [
  ...sharedConfig,
  {
    files: ['tests/support/scenarios/**/*'],
    rules: {
      'local/no-mixed-exports': 'off',
      'jsdoc/check-alignment': 'off',
      'jsdoc/check-indentation': 'off',
      'jsdoc/check-types': 'off',
      'jsdoc/check-tag-names': 'off',
      'jsdoc/lines-before-block': 'off',
      'jsdoc/require-description': 'off',
      'jsdoc/require-hyphen-before-param-description': 'off',
      'jsdoc/require-jsdoc': 'off',
      'jsdoc/require-param': 'off',
      'jsdoc/require-returns': 'off'
    }
  },
  {
    files: ['tests/support/data/**/*'],
    rules: {
      'jsdoc/require-jsdoc': 'off'
    }
  }
]

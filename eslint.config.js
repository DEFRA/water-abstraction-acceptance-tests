import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import globals from 'globals'
import neostandard from 'neostandard'

export default [
  {
    ignores: ['cypress/reports/**/*']
  },
  ...neostandard({ noStyle: true }),
  {
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        after: 'readonly',
        afterEach: 'readonly',
        before: 'readonly',
        beforeEach: 'readonly',
        cy: 'readonly',
        Cypress: 'readonly',
        describe: 'readonly',
        expect: 'readonly',
        it: 'readonly'
      },
      sourceType: 'module'
    },
    plugins: {
      import: neostandard.plugins['import-x']
    },
    rules: {
      'import/extensions': ['error', 'always']
    }
  },
  {
    files: ['eslint.config.js'],
    rules: {
      'import/extensions': 'off'
    }
  },
  eslintPluginPrettierRecommended,
  {
    rules: {
      'arrow-body-style': ['error', 'always']
    }
  }
]
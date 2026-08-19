import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import globals from 'globals'
import neostandard from 'neostandard'

export default [
  {
    ignores: ['test-results/**/*', 'playwright-report/**/*']
  },
  ...neostandard({ noStyle: true }),
  {
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser
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

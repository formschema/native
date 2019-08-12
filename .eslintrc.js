/* eslint-disable quote-props */

module.exports = {
  root: true,
  env: {
    browser: true
  },
  parser: '@typescript-eslint/parser',
  plugins: [
    'import',
    '@typescript-eslint'
  ],
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  settings: {
    'import/resolver': {
      typescript: {}
    }
  },
  rules: {
    'import/no-unresolved': 'error',
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-cycle': 'off',
    'comma-dangle': 'off',
    'prefer-destructuring': 'off',
    'semi': ['error', 'always'],
    'class-methods-use-this': 'error',
    'block-scoped-var': 'error',
    'no-console': 'error',
    'no-debugger': 'error',
    'no-lonely-if': 'error',
    'no-plusplus': 'off',
    'lines-between-class-members': 'off',
    'class-methods-use-this': ['error', {
      exceptMethods: ['type', 'kind', 'parseValue']
    }],
    'max-len': [
      'error',
      {
        code: 125,
        comments: 125,
        tabWidth: 2,
        ignoreUrls: true,
        ignoreRegExpLiterals: true,
        ignoreTemplateLiterals: true
      }
    ],
    'complexity': [ 'error', { max: 40 } ],
    'no-use-before-define': [
      'error',
      {
        classes: false,
        functions: false
      }
    ],
    'arrow-parens': [ 'error', 'always' ],
    'arrow-body-style': 'off',
    'object-shorthand': 'off',
    'guard-for-in': 'off',
    'no-nested-ternary': 'off',
    'object-curly-newline': 'off',
    'array-bracket-spacing': [ 'error', 'always' ],
    'no-param-reassign': 'off',
    'default-case': 'off',
    'no-shadow': 'off',
    'no-restricted-syntax': 'off',
    'no-prototype-builtins': 'off',
    'space-before-function-paren': 'off',
    'no-var': 'error',
    'padding-line-between-statements': [
      'error',
      { 'blankLine': 'always', 'prev': 'block-like', 'next': '*' },
      { 'blankLine': 'always', 'prev': '*', 'next': 'block-like' },
      { 'blankLine': 'any', 'prev': 'block-like', 'next': ['block-like', 'break'] },
      // require blank lines before all return statements
      { 'blankLine': 'always', 'prev': '*', 'next': 'return' },
      // require blank lines after every sequence of variable declarations
      { 'blankLine': 'always', 'prev': ['const', 'let', 'var'], 'next': '*'},
      { 'blankLine': 'any',    'prev': ['const', 'let', 'var'], 'next': ['const', 'let', 'var']},
      // require blank lines after all directive prologues
      { 'blankLine': 'always', 'prev': 'directive', 'next': '*' },
      { 'blankLine': 'any',    'prev': 'directive', 'next': 'directive' }
    ]
  }
}

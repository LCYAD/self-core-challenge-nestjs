module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'import',
    'jsdoc',
    'prefer-arrow',
    'simple-import-sort'
  ],
  extends: [
    'prettier',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],
  root: true,
  env: {
    node: true,
    jest: true
  },
  ignorePatterns: ['.eslintrc.js', 'dist', 'node_modules'],
  rules: {
    '@typescript-eslint/await-thenable': 'warn',
    '@typescript-eslint/array-type': [
      'error',
      {
        default: 'array'
      }
    ],
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: {
          Object: {
            message: 'Avoid using the `Object` type. Did you mean `object`?'
          },
          Function: {
            message:
              'Avoid using the `Function` type. Prefer a specific function type, like `() => void`.'
          },
          Boolean: {
            message: 'Avoid using the `Boolean` type. Did you mean `boolean`?'
          },
          Number: {
            message: 'Avoid using the `Number` type. Did you mean `number`?'
          },
          String: {
            message: 'Avoid using the `String` type. Did you mean `string`?'
          },
          Symbol: {
            message: 'Avoid using the `Symbol` type. Did you mean `symbol`?'
          }
        }
      }
    ],
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/class-name-casing': 'off',
    '@typescript-eslint/dot-notation': 'error',
    '@typescript-eslint/explicit-member-accessibility': [
      'off',
      {
        accessibility: 'explicit'
      }
    ],
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/member-delimiter-style': [
      'off',
      {
        multiline: {
          delimiter: 'none',
          requireLast: true
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false
        }
      }
    ],
    '@typescript-eslint/member-ordering': 'off',
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-parameter-properties': 'off',
    '@typescript-eslint/no-unused-expressions': 'error',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/prefer-for-of': 'error',
    '@typescript-eslint/prefer-function-type': 'error',
    '@typescript-eslint/prefer-includes': 'off',
    '@typescript-eslint/quotes': ['error', 'single'],
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/semi': ['off', null],
    '@typescript-eslint/no-shadow': ['error', { ignoreTypeValueShadow: true }],
    '@typescript-eslint/triple-slash-reference': [
      'error',
      {
        path: 'always',
        types: 'prefer-import',
        lib: 'always'
      }
    ],
    '@typescript-eslint/unified-signatures': 'error',
    '@typescript-eslint/unbound-method': 'off',
    // to be reviewed
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unsafe-argument': 'warn',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    // end here
    'arrow-parens': ['off', 'always'],
    'comma-dangle': 'off',
    complexity: 'off',
    'constructor-super': 'error',
    eqeqeq: ['error', 'smart'],
    'guard-for-in': 'error',
    'id-blacklist': 'error',
    'id-match': 'error',
    'import/no-unresolved': 'off',
    'import/named': 'error',
    'import/namespace': 'off',
    'import/default': 'warn',
    'import/export': 'error',
    'import/no-duplicates': 'error',
    'import/order': 'off',
    'jsdoc/check-alignment': 'error',
    'jsdoc/check-indentation': 'error',
    'jsdoc/newline-after-description': 'error',
    'max-classes-per-file': ['error', 5],
    'no-shadow': 'off',
    'max-len': [
      'error',
      {
        code: 300,
        ignoreUrls: true,
        ignoreStrings: true
      }
    ],
    'new-parens': 'error',
    'no-bitwise': 'error',
    'no-caller': 'error',
    'no-cond-assign': 'error',
    'no-console': 'off',
    'no-debugger': 'error',
    'no-empty': 'error',
    'no-eval': 'error',
    'no-fallthrough': 'off',
    'no-invalid-this': 'off',
    'no-new-wrappers': 'error',
    'no-throw-literal': 'error',
    'no-trailing-spaces': 'error',
    'no-undef-init': 'error',
    'no-underscore-dangle': 'off', // to be reviewed
    'no-unsafe-finally': 'error',
    'no-unused-labels': 'error',
    'object-shorthand': 'error',
    'one-var': ['error', 'never'],
    'prefer-arrow/prefer-arrow-functions': [
      'warn',
      {
        disallowPrototype: true,
        singleReturnOnly: false,
        classPropertiesAllowed: false
      }
    ],
    'prefer-const': [
      'error',
      {
        destructuring: 'any',
        ignoreReadBeforeAssign: true
      }
    ],
    'prefer-rest-params': 'off',
    radix: 'error',
    'spaced-comment': [
      'error',
      'always',
      {
        markers: ['/']
      }
    ],
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          ['^@nestjs.*'],
          ['^[^.^@].*'],
          [
            '^@(config|constants|decorators|dtos|exceptions|filters|guards|interceptors|middlewares|models|modules|pipes|utils|tests).*'
          ],
          ['^[.].*']
        ]
      }
    ],
    'sort-imports': 'off',
    'use-isnan': 'error',
    'valid-typeof': 'off'
  }
}

const config = {
  extends: 'eslint:recommended',
  env: {
    es6: true,
  },
  rules: {
    'no-unused-vars': 'off',
    'no-undef': 'off',
    'comma-dangle': [
      'error', {
        'objects': 'always'
      }
    ],
    indent: ['error', 2],
    'linebreak-style': ['error', 'windows'],
    quotes: ['error', 'single'],
  },
}

module.exports = config
module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'airbnb',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      'babel-eslint': true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: { 'react/jsx-filename-extension': [0] },
  overrides: [
    {
      files: '*.spec.js',
      rules: {
        'no-unused-expressions': 'off',
      },
    },
  ],
};

module.exports = {
    parser: '@babel/eslint-parser',
    env: {
      browser: true,
      es6: true,
    },
    extends: ['eslint:recommended', 'plugin:prettier/recommended'],
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
    },
};
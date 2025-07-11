module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  globals: {
    // Greasemonkey/Tampermonkey globals
    GM_setValue: 'readonly',
    GM_getValue: 'readonly',
    GM_deleteValue: 'readonly',
    GM_listValues: 'readonly',
    GM_log: 'readonly',
    GM_notification: 'readonly',
    GM_openInTab: 'readonly',
    GM_registerMenuCommand: 'readonly',
    GM_unregisterMenuCommand: 'readonly',
    GM_xmlhttpRequest: 'readonly',
    GM_info: 'readonly',
    unsafeWindow: 'readonly',
  },
  rules: {
    'no-console': 'off',
    'no-debugger': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
    'no-unused-vars': 'off',
    'no-undef': 'off',
  },
  ignorePatterns: ['dist/', 'node_modules/', 'tools/**/*.js'],
};

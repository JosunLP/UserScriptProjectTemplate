import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.es2015,
        ...globals.node,
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
    },
    rules: {
      'no-console': 'off',
      'no-debugger': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-unused-vars': 'off',
      'no-undef': 'off',
    },
  },
  {
    ignores: ['dist/', 'node_modules/', 'tools/**/*.js'],
  },
];

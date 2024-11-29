import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import configPrettier from 'eslint-config-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'prettier/prettier': 'error',
    },
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn', // Or "error"
        {
          vars: 'all', // Check all variables
          args: 'after-used', // Ignore unused arguments after the last used one
          ignoreRestSiblings: true, // Ignore destructuring rest siblings
          varsIgnorePattern: '^_', // Ignore variables starting with _
          argsIgnorePattern: '^_', // Ignore arguments starting with _
        },
      ],
      'no-console': 'error',
      'prettier/prettier': 'error',
    },
  },
  {
    files: ['**/*.cjs', '**/*.mjs'],
    languageOptions: {
      sourceType: 'commonjs',
    },
  },
  {
    languageOptions: {
      globals: globals.node,
    },
  },
  configPrettier,
];

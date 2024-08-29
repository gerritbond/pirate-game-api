import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  prettierConfig,
  {
    files: ['**/*.{js,ts}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': ts,
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
      // Add any custom TypeScript rules here
    },
    settings: {
      // Add any settings here
    },
  },
];

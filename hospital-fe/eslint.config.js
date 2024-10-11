const angularEslintPlugin = require('@angular-eslint/eslint-plugin');
const angularEslintTemplatePlugin = require('@angular-eslint/eslint-plugin-template');
const typescriptEslintParser = require('@typescript-eslint/parser');

/** @type {import('eslint').Linter.Config} */
const config = [
  {
    files: ['*.ts'],
    ignores: ['node_modules', 'dist'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parser: typescriptEslintParser,
      parserOptions: {
        project: ['./tsconfig.json'],
      },
    },
    plugins: {
      '@angular-eslint': angularEslintPlugin,
      prettier: require('eslint-plugin-prettier'),
    },
    rules: {
      // Angular ESLint Recommended Rules
      ...angularEslintPlugin.configs['recommended'].rules,
      'prettier/prettier': 'error',
    },
  },
  {
    files: ['*.html'],
    languageOptions: {
      parser: '@angular-eslint/template-parser',
    },
    plugins: {
      '@angular-eslint/template': angularEslintTemplatePlugin,
    },
    rules: {
      // Angular ESLint Template Recommended Rules
      ...angularEslintTemplatePlugin.configs['recommended'].rules,
    },
  },
];

module.exports = config;

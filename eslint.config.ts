import styleMigrate from '@stylistic/eslint-plugin-migrate';
import { fino } from './src';
import { ERROR, OFF } from './src/constants';

export default fino(
  {
    formatters: true,
    rules: {
      'perfectionist/sort-objects': ERROR,
      'ts/method-signature-style': OFF,
    },
    stylistic: {
      quotes: 'single',
      semi: true,
    },
    type: 'lib',
    typescript: true,
  },
  {
    files: ['src/**/*.ts'],
    rules: {
      'perfectionist/sort-objects': ERROR,
      'ts/method-signature-style': OFF,
      'ts/no-explicit-any': OFF,
    },
  },
  {
    files: ['package.json'],
    rules: {
      'jsonc/sort-keys': OFF,
      'perfectionist/sort-objects': OFF,
    },
  },
  {
    files: ['scripts/**/*.ts'],
    rules: {
      'node/prefer-global/process': OFF,
      'unicorn/prefer-number-properties': OFF,
    },
  },
  {
    files: ['src/configs/*.ts'],
    plugins: {
      'style-migrate': styleMigrate,
    },
    rules: {
      'style-migrate/migrate': [ERROR, { namespaceTo: 'style' }],
      'style-migrate/migrate-ts': [
        ERROR,
        { namespaceFrom: 'ts', namespaceTo: '@typescript-eslint' },
      ],
    },
  },
  {
    files: ['scripts/**/*.ts'],
    rules: {
      'node/prefer-global/process': OFF,
    },
  },
  {
    files: ['src/**/*.ts'],
    rules: {
      'ts/method-signature-style': OFF,
    },
  }
);

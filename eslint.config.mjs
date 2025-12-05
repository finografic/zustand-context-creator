import antfu from '@antfu/eslint-config';

export default antfu({
  typescript: true,
  gitignore: true,
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    globals: {
      log: 'readonly',
      getDotEnv: 'readonly',
    },
  },
  rules: {
    'node/prefer-global/process': 'off',
    'prefer-regex-literals': 'error',
    // Allow unused variables/args/errors when prefixed with underscore
    'no-unused-vars': 'off', // Turn off base rule
    // Semicolons: match Prettier config (semi: true)
    'style/semi': ['error', 'always'],
    'ts/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
      },
    ],
    // Also configure unused-imports plugin
    'unused-imports/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
  },
});

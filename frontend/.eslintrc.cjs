module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
    '@feature-sliced',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  // settings: {
  //   'import/resolver': {
  //     typescript: {
  //       alwaysTryTypes: true,
  //     },
  //   },
  // },
  plugins: ['react-refresh', 'prettier'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    'no-debugger': ['warn'],
    '@typescript-eslint/no-unused-vars': ['warn'],
    '@typescript-eslint/no-explicit-any': 'off',
    'react-refresh/only-export-components': ['off'],
  },
};

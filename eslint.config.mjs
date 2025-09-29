import rules from '@shelf/eslint-config/typescript.js';

export default [
  ...rules,
  {files: ['**/*.js', '**/*.mjs', '**/*.jsx', '**/*.ts', '**/*.tsx', '**/*.json']},
  {
    ignores: [
      '**/node_modules/',
      '**/coverage/',
      '**/lib/',
      '**/dist/',
      'renovate.json',
      'tsconfig.json',
      '.pnpm-store/',
    ],
  },
  {
    files: ['tests/**/*.{js,jsx,ts,tsx,mjs}'],
    rules: {
      'multiline-ternary': 'off',
    },
  },
];

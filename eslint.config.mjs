import rules from '@shelf/eslint-config/typescript.js';

export default [
  ...rules,
  {files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx', '**/*.json']},
  {
    ignores: [
      '**/node_modules/',
      '**/coverage/',
      '**/lib/',
      'renovate.json',
      'tsconfig.json',
      '.pnpm-store/',
    ],
  },
];

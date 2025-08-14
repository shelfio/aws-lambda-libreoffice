#!/usr/bin/env node
import {existsSync, mkdirSync} from 'fs';
import * as esbuild from 'esbuild';

if (!existsSync('./dist')) {
  mkdirSync('./dist');
}

await esbuild.build({
  entryPoints: ['./test.js'],
  bundle: true,
  outfile: './dist/test.js',
  platform: 'node',
  target: 'node20',
  format: 'cjs',
  external: [
    // Keep native modules external
    'child_process',
    'fs',
    'fs/promises',
    'path',
    'util',
    'node:path',
  ],
  logLevel: 'info',
});

console.log('Lambda handler built successfully to ./dist/test.js');

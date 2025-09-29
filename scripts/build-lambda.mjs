#!/usr/bin/env node
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {buildLambdaBundle} from './utils/lambda.js';

const parseArgs = argv => {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];

    if (value === '--outfile' || value === '-o') {
      args.outfile = argv[index + 1];
      index += 1;
      continue;
    }

    if (value === '--entry') {
      args.entry = argv[index + 1];
      index += 1;
      continue;
    }
  }

  return args;
};

const main = async () => {
  const args = parseArgs(process.argv.slice(2));

  try {
    const outfile = await buildLambdaBundle(args);
    console.log(`Lambda bundle generated at ${outfile}`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
};

const executedFile = fileURLToPath(import.meta.url);

if (process.argv[1] && path.resolve(process.argv[1]) === executedFile) {
  await main();
}

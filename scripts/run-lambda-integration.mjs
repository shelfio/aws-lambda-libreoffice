#!/usr/bin/env node
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {isPodmanAvailable, removeTempDir, runLambdaContainer} from './utils/lambda.js';

const parseArgs = argv => {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];

    if (value === '--image-tag') {
      args.imageTag = argv[index + 1];
      index += 1;
      continue;
    }

    if (value === '--base-image') {
      args.baseImage = argv[index + 1];
      index += 1;
      continue;
    }

    if (value === '--bundle') {
      args.bundlePath = argv[index + 1];
      index += 1;
      continue;
    }

    if (value === '--fixtures') {
      args.documentsDir = argv[index + 1];
      index += 1;
      continue;
    }

    if (value === '--port') {
      args.port = Number(argv[index + 1]);
      index += 1;
      continue;
    }

    if (value === '--cleanup') {
      args.cleanup = true;
      continue;
    }
  }

  return args;
};

const main = async () => {
  const args = parseArgs(process.argv.slice(2));

  if (!(await isPodmanAvailable())) {
    console.error('podman is not available. Install it to run the Lambda integration harness.');
    process.exitCode = 1;

    return;
  }

  let cleanupDir;

  try {
    const result = await runLambdaContainer(args);
    cleanupDir = result.outputDir;

    console.log('Lambda invocation response:', result.response);

    if (result.results) {
      console.log('Conversion results parsed from logs:', result.results);
    } else {
      console.log('Raw container logs:\n', result.logs);
    }

    console.log('Generated files:', result.outputFiles);
    console.log(`Output directory: ${result.outputDir}`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  } finally {
    if (args.cleanup && cleanupDir) {
      await removeTempDir(cleanupDir);
    }
  }
};

const executedFile = fileURLToPath(import.meta.url);

if (process.argv[1] && path.resolve(process.argv[1]) === executedFile) {
  await main();
}

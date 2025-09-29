import {existsSync} from 'node:fs';
import path from 'node:path';
import esbuild from 'esbuild';
import {ensureDirectory} from './io.js';
import {lambdaBundlePath, lambdaSourceEntry, projectRoot} from './paths.js';

export const buildLambdaBundle = async ({
  entry = lambdaSourceEntry,
  outfile = lambdaBundlePath,
} = {}) => {
  const buildOutputDir = path.dirname(outfile);

  if (!existsSync(path.join(projectRoot, 'lib/index.js'))) {
    throw new Error('Missing lib/index.js. Run `pnpm build` before building the Lambda bundle.');
  }

  ensureDirectory(buildOutputDir);

  await esbuild.build({
    entryPoints: [entry],
    bundle: true,
    platform: 'node',
    target: 'node20',
    format: 'cjs',
    outfile,
    logLevel: 'info',
    external: ['child_process', 'fs', 'fs/promises', 'path', 'util', 'node:path'],
  });

  return outfile;
};

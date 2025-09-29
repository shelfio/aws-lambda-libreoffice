import {fileURLToPath} from 'node:url';
import path from 'node:path';

const currentFilename = fileURLToPath(import.meta.url);
const utilsDir = path.dirname(currentFilename);

export const projectRoot = path.resolve(utilsDir, '..', '..');
export const lambdaSourceEntry = path.join(projectRoot, 'tests/integration/lambda/handler.ts');
export const lambdaDistDir = path.join(projectRoot, 'dist/lambda');
export const lambdaBundlePath = path.join(lambdaDistDir, 'handler.cjs');
export const lambdaFixturesDir = path.join(
  projectRoot,
  'tests/integration/lambda/__fixtures__/documents'
);
export const lambdaDockerfile = path.join(projectRoot, 'tests/integration/lambda/Dockerfile');

export const resolveProjectPath = (...segments) => path.join(projectRoot, ...segments);

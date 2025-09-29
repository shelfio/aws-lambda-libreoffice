import path from 'node:path';
import {isPodmanAvailable} from '../../../scripts/utils/podman.js';
import {removeTempDir, runLambdaContainer} from '../../../scripts/utils/lambda.js';

export type ConversionStatus = 'success' | 'no-output-dir' | 'error';

export type ConversionResult = {
  input: string;
  output?: string;
  status: ConversionStatus;
  error?: string;
};

export type LambdaRunResult = {
  response: unknown;
  logs: string;
  outputDir: string;
  outputFiles: string[];
  results: ConversionResult[] | null;
};

export type LambdaRunOptions = {
  imageTag?: string;
  containerName?: string;
  port?: number;
  bundlePath?: string;
  documentsDir?: string;
  outputDir?: string;
  timeoutMs?: number;
  baseImage?: string;
  invocationPayload?: unknown;
};

export const FIXTURES_DIRECTORY = path.join(
  process.cwd(),
  'tests/integration/lambda/__fixtures__/documents'
);

export const canRunIntegration = isPodmanAvailable;

export const runIntegration = async (options: LambdaRunOptions = {}): Promise<LambdaRunResult> => {
  const result = await runLambdaContainer({
    documentsDir: FIXTURES_DIRECTORY,
    ...options,
  });

  return result;
};

export const cleanupIntegrationOutput = removeTempDir;

/* eslint jest/no-standalone-expect: "off" */

import {spawnSync} from 'node:child_process';
import {type ConversionResult, cleanupIntegrationOutput, runIntegration} from './runner';

const baseImage = process.env.LIBREOFFICE_LAMBDA_BASE_IMAGE ?? 'libreoffice-lambda-base:local';

const podmanAvailable =
  spawnSync('podman', ['--version'], {
    stdio: 'ignore',
  }).status === 0;

const baseImageAvailable = podmanAvailable
  ? spawnSync('podman', ['image', 'exists', baseImage], {
      stdio: 'ignore',
    }).status === 0
  : false;

const runIntegrationTest = podmanAvailable && baseImageAvailable ? it : it.skip;

if (!podmanAvailable) {
  console.warn('Skipping lambda integration tests because podman is not available.');
} else if (!baseImageAvailable) {
  console.warn(
    `Skipping lambda integration tests because base image "${baseImage}" is not available.`
  );
}

describe('lambda handler integration', () => {
  runIntegrationTest('converts supported fixtures to PDF', async () => {
    const runResult = await runIntegration({
      baseImage,
    });

    try {
      const parsedResponse = (() => {
        if (typeof runResult.response === 'string') {
          try {
            return JSON.parse(runResult.response);
          } catch {
            return null;
          }
        }

        return runResult.response as {body?: string} | null;
      })();

      const responsePayload = (() => {
        if (!parsedResponse?.body) {
          return null;
        }

        try {
          return JSON.parse(parsedResponse.body);
        } catch {
          return null;
        }
      })();

      const lambdaResults = (runResult.results ??
        responsePayload?.results ??
        []) as ConversionResult[];

      if (parsedResponse) {
        expect(parsedResponse.statusCode).toBe(200);
      }

      expect(Array.isArray(lambdaResults)).toBe(true);
      expect(lambdaResults.length).toBeGreaterThan(0);
      expect(lambdaResults.every(result => result.status === 'success')).toBe(true);
      expect(runResult.outputFiles.every(file => file.endsWith('.pdf'))).toBe(true);
    } finally {
      await cleanupIntegrationOutput(runResult.outputDir);
    }
  });
});

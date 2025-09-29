import {existsSync, readdirSync} from 'node:fs';
import {lambdaBundlePath, lambdaDockerfile, lambdaFixturesDir, projectRoot} from './paths.js';
import {createTempDir, ensureDirectory, removeDir} from './io.js';
import {buildLambdaBundle as bundleLambda} from './bundler.js';
import {
  buildImage,
  collectContainerLogs,
  runContainer,
  stopContainer,
  waitForTcpPort,
} from './podman.js';

export {isPodmanAvailable} from './podman.js';
export {buildLambdaBundle} from './bundler.js';

const invokeLambda = async (port, payload, {attempts = 10, delayMs = 1000} = {}) => {
  const endpoint = new URL(`http://127.0.0.1:${port}/2015-03-31/functions/function/invocations`);
  let lastError;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Lambda invocation failed with status ${response.status}: ${text}`);
      }

      const text = await response.text();

      try {
        return JSON.parse(text);
      } catch {
        return text;
      }
    } catch (error) {
      lastError = error;
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  if (lastError instanceof Error) {
    throw lastError;
  }

  throw new Error('Lambda invocation failed without error details');
};

const extractResultsFromLogs = logs => {
  const marker = '=== Conversion Summary ===';
  const markerIndex = logs.lastIndexOf(marker);

  if (markerIndex === -1) {
    return null;
  }

  const afterMarker = logs.slice(markerIndex + marker.length);
  const match = afterMarker.match(/\[(?:.|\n)*?]/);

  if (!match) {
    return null;
  }

  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
};

export const prepareIntegrationImage = async ({
  bundlePath = lambdaBundlePath,
  imageTag = 'lo-lambda-test',
  dockerfile = lambdaDockerfile,
  buildContext = projectRoot,
  baseImage = 'libreoffice-lambda-base:local',
  platform = 'linux/amd64',
} = {}) => {
  if (!existsSync(bundlePath)) {
    throw new Error(`Bundle not found at ${bundlePath}. Build the Lambda bundle first.`);
  }

  await buildImage({
    imageTag,
    dockerfile,
    buildContext,
    baseImage,
    platform,
  });

  return imageTag;
};

export const runLambdaContainer = async ({
  imageTag = 'lo-lambda-test',
  containerName = `lo-lambda-test-${Date.now()}`,
  port = 9000,
  bundlePath = lambdaBundlePath,
  documentsDir = lambdaFixturesDir,
  outputDir = createTempDir(),
  timeoutMs = 60000,
  baseImage = 'libreoffice-lambda-base:local',
  invocationPayload = {payload: 'batch conversion'},
} = {}) => {
  if (!existsSync(documentsDir)) {
    throw new Error(`Fixtures directory not found: ${documentsDir}`);
  }

  await bundleLambda({outfile: bundlePath});
  await prepareIntegrationImage({
    bundlePath,
    imageTag,
    baseImage,
  });

  ensureDirectory(outputDir);

  await runContainer({
    imageTag,
    containerName,
    publish: [`${port}:8080`],
    mounts: [`type=bind,source=${outputDir},destination=/tmp/test-data,Z`],
  });

  try {
    await waitForTcpPort(port, {timeoutMs: timeoutMs / 2});
    const response = await invokeLambda(port, invocationPayload);
    const logs = await collectContainerLogs(containerName);

    return {
      response,
      logs,
      outputDir,
      outputFiles: readdirSync(outputDir),
      results: extractResultsFromLogs(logs),
    };
  } finally {
    await stopContainer(containerName);
  }
};

export const removeTempDir = removeDir;

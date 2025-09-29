import {spawn} from 'node:child_process';
import net from 'node:net';
import {projectRoot} from './paths.js';

const podmanBaseArgs = [];

export const runCommand = (
  command,
  args,
  {cwd = projectRoot, env = process.env, capture = false} = {}
) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      env,
      stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
    });

    if (!capture) {
      child.on('close', code => {
        if (code === 0) {
          resolve({stdout: '', stderr: ''});
        } else {
          reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
        }
      });

      return;
    }

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', chunk => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', chunk => {
      stderr += chunk.toString();
    });

    child.on('close', code => {
      if (code === 0) {
        resolve({stdout, stderr});
      } else {
        reject(new Error(`${command} ${args.join(' ')} failed: ${stderr || stdout}`));
      }
    });
  });

export const isPodmanAvailable = async () => {
  try {
    await runCommand('podman', [...podmanBaseArgs, '--version'], {capture: true});

    return true;
  } catch {
    return false;
  }
};

export const buildImage = async ({
  imageTag,
  dockerfile,
  buildContext = projectRoot,
  baseImage,
  platform = 'linux/amd64',
}) => {
  const args = [
    ...podmanBaseArgs,
    'build',
    '--platform',
    platform,
    '--tag',
    imageTag,
    '--build-arg',
    `BASE_IMAGE=${baseImage}`,
    '--file',
    dockerfile,
    buildContext,
  ];

  await runCommand('podman', args);

  return imageTag;
};

export const runContainer = async ({
  imageTag,
  containerName,
  platform = 'linux/amd64',
  publish = [],
  mounts = [],
  env = {},
  detach = true,
  capture = false,
}) => {
  const args = [...podmanBaseArgs, 'run'];

  if (detach) {
    args.push('--detach');
  }

  if (platform) {
    args.push('--platform', platform);
  }

  publish.forEach(mapping => {
    args.push('--publish', mapping);
  });

  if (containerName) {
    args.push('--name', containerName);
  }

  mounts.forEach(mount => {
    args.push('--mount', mount);
  });

  Object.entries(env).forEach(([key, value]) => {
    args.push('--env', `${key}=${value}`);
  });

  args.push(imageTag);

  return await runCommand('podman', args, {capture});
};

export const stopContainer = async containerName => {
  try {
    await runCommand('podman', [...podmanBaseArgs, 'stop', containerName], {capture: true});
  } catch {
    // Container might already be stopped; ignore errors to avoid masking test output.
  }

  try {
    await runCommand('podman', [...podmanBaseArgs, 'rm', containerName], {capture: true});
  } catch {
    // Container might already be cleaned up; ignore errors.
  }
};

export const collectContainerLogs = async containerName => {
  const {stdout} = await runCommand('podman', [...podmanBaseArgs, 'logs', containerName], {
    capture: true,
  });

  return stdout;
};

export const waitForTcpPort = async (port, {host = '127.0.0.1', timeoutMs = 30000} = {}) => {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const connected = await new Promise(resolve => {
      const socket = net.createConnection({port, host}, () => {
        socket.end();
        resolve(true);
      });

      socket.on('error', () => {
        socket.destroy();
        resolve(false);
      });
    });

    if (connected) {
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 500));
  }

  throw new Error(`TCP port ${host}:${port} did not become ready within ${timeoutMs}ms`);
};

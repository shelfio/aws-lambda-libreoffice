import childProcess from 'child_process';
import util from 'util';
import path from 'node:path';
import {cleanupTempFiles} from './cleanup.js';
import {getConvertedFilePath} from './logs.js';

const exec = util.promisify(childProcess.exec);

export const DEFAULT_ARGS = [
  '--headless',
  '--invisible',
  '--nodefault',
  '--view',
  '--nolockcheck',
  '--nologo',
  '--norestore',
];
const LO_BINARY_PATH = 'libreoffice25.2';

export async function convertTo(filename: string, format: string): Promise<string> {
  await cleanupTempFiles();

  const argumentsString = DEFAULT_ARGS.join(' ');
  const outputFilename = filename.split(/\\ /).join(' ');

  const cmd = `cd /tmp && ${LO_BINARY_PATH} ${argumentsString} --convert-to ${format} --outdir /tmp '/tmp/${outputFilename}'`;

  let logs;
  let err;

  // due to an unknown issue, we need to run command twice
  try {
    const {stdout, stderr} = await exec(cmd);
    logs = stdout;
    err = stderr;
  } catch {
    const {stdout, stderr} = await exec(cmd);
    logs = stdout;
    err = stderr;
  } finally {
    await exec(`rm '/tmp/${outputFilename}'`);
    await cleanupTempFiles();
  }

  // Check if conversion was successful by looking for the output pattern in logs
  const logsStr = logs.toString();

  if (!logsStr.includes('->')) {
    throw new Error(`Cannot generate PDF preview for .${path.extname(outputFilename)} file`, {
      cause: `Error:${err.toString()}\nLogs: ${logsStr}`,
    });
  }

  return getConvertedFilePath(logsStr);
}

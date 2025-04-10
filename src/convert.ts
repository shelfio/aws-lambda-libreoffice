import childProcess from 'child_process';
import util from 'util';
import path from 'node:path';
import {cleanupTempFiles} from './cleanup';
import {getConvertedFilePath} from './logs';

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
const LO_BINARY_PATH = 'libreoffice7.6';

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
  } catch (e) {
    const {stdout, stderr} = await exec(cmd);
    logs = stdout;
    err = stderr;
  } finally {
    await exec(`rm '/tmp/${outputFilename}'`);
    await cleanupTempFiles();
  }

  if (err) {
    throw new Error(`Cannot generate PDF preview for .${path.extname(outputFilename)} file`, {
      cause: logs,
    });
  }

  return getConvertedFilePath(logs.toString());
}

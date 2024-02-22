import childProcess from 'child_process';
import util from 'util';
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

  // due to an unknown issue, we need to run command twice
  try {
    logs = (await exec(cmd)).stdout;
  } catch (e) {
    logs = (await exec(cmd)).stdout;
  }

  await exec(`rm '/tmp/${outputFilename}'`);
  await cleanupTempFiles();

  return getConvertedFilePath(logs.toString());
}

import {execSync} from 'child_process';
import {cleanupTempFiles} from './cleanup';
import {getConvertedFilePath} from './logs';

export const DEFAULT_ARGS = [
  '--headless',
  '--invisible',
  '--nodefault',
  '--view',
  '--nolockcheck',
  '--nologo',
  '--norestore',
];
const LO_BINARY_PATH = 'libreoffice7.4';

export function convertTo(filename: string, format: string): string {
  cleanupTempFiles();

  const argumentsString = DEFAULT_ARGS.join(' ');
  const outputFilename = filename.split(/\\ /).join(' ');

  const cmd = `cd /tmp && ${LO_BINARY_PATH} ${argumentsString} --convert-to ${format} --outdir /tmp '/tmp/${outputFilename}'`;

  let logs;

  // due to an unknown issue, we need to run command twice
  try {
    logs = execSync(cmd);
  } catch (e) {
    logs = execSync(cmd);
  }

  execSync(`rm '/tmp/${outputFilename}'`);
  cleanupTempFiles();

  return getConvertedFilePath(logs.toString());
}

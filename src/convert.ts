import {execSync} from 'child_process';
import {cleanupTempFiles} from './cleanup';
import {getConvertedFilePath} from './logs';
import {enableAllExtensions} from './extensions';

export const DEFAULT_ARGS = [
  '--headless',
  '--invisible',
  '--nodefault',
  '--view',
  '--nolockcheck',
  '--nologo',
  '--norestore',
  '--nofirststartwizard',
];
const LO_BINARY_PATH = 'libreoffice7.3';

type Options = {
  extensions: string[];
  shouldThrowOnExtensionFail?: boolean;
};

export function convertTo(filename: string, format: string, options?: Options): string {
  cleanupTempFiles();

  if (options?.extensions?.length) {
    enableAllExtensions(options.extensions, options.shouldThrowOnExtensionFail);
  }

  const argumentsString = DEFAULT_ARGS.join(' ');
  const outputFilename = filename.split(/\\ /).join(' ');

  const cmd = `cd /tmp && ${LO_BINARY_PATH} ${argumentsString} --convert-to ${format} --outdir /tmp /tmp/${outputFilename}`;

  let logs;

  // due to an unknown issue, we need to run command twice
  try {
    logs = execSync(cmd);
  } catch (e) {
    logs = execSync(cmd);
  }

  execSync(`rm /tmp/${outputFilename}`);
  cleanupTempFiles();

  return getConvertedFilePath(logs.toString());
}

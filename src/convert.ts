import {execSync} from 'child_process';
import {unpack} from './unpack';
import {cleanupTempFiles} from './cleanup';
import {getConvertedFilePath} from './logs';

export const defaultArgs = [
  '--headless',
  '--invisible',
  '--nodefault',
  '--view',
  '--nolockcheck',
  '--nologo',
  '--norestore',
  '--nofirststartwizard'
];

const INPUT_PATH = '/opt/lo.tar.br';
const OUTPUT_PATH = '/tmp/instdir/program/soffice.bin';
const UNOPKG_OUTPUT_PATH = '/tmp/instdir/program/unopkg.bin';

/**
 * Converts a file in /tmp to the desired file format
 * @param {String} filename Name of the file to convert located in /tmp directory
 * @param {String} format File format to convert incoming file to
 * @param {Array} extensions
 * @return {Promise<String>} Absolute path to the converted file
 */
export async function convertTo(
  filename: string,
  format: string,
  extensions: string[] = []
): Promise<string> {
  let logs;
  cleanupTempFiles();
  await unpack({inputPath: INPUT_PATH});

  extensions.forEach(extension => {
    execSync(`${UNOPKG_OUTPUT_PATH} add --shared ${extension}`);
  });

  const cmd = `cd /tmp && ${OUTPUT_PATH} ${defaultArgs.join(
    ' '
  )} --convert-to ${format} --outdir /tmp /tmp/${filename}`;
  // due to unknown issue, we need to run command twice
  try {
    logs = execSync(cmd);
  } catch (e) {
    logs = execSync(cmd);
  }

  execSync(`rm /tmp/${filename}`);
  cleanupTempFiles();

  return getConvertedFilePath(logs.toString('utf8'));
}

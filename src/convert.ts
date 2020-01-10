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

/**
 * Converts a file in /tmp to the desired file format
 * see https://github.com/alixaxel/chrome-aws-lambda
 * @param {String} filename Name of the file to convert located in /tmp directory
 * @param {String} format File format to convert incoming file to
 * @return {Promise<String>} Absolute path to the converted file
 */
export async function convertTo(filename: string, format: string): Promise<string> {
  cleanupTempFiles();
  await unpack({inputPath: INPUT_PATH});

  const logs = execSync(
    `cd /tmp && ${OUTPUT_PATH} ${defaultArgs.join(
      ' '
    )} --convert-to ${format} --outdir /tmp /tmp/${filename}`
  );

  execSync(`rm /tmp/${filename}`);
  cleanupTempFiles();

  return getConvertedFilePath(logs.toString('utf8'));
}

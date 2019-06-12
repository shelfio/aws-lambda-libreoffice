import {unpack} from '@shelf/aws-lambda-brotli-unpacker';
import {execSync} from 'child_process';
import {cleanupTempFiles} from './cleanup';
import {getConvertedFilePath} from './logs';

export const defaultArgs = [
  '--headless',
  '--invisible',
  '--nodefault',
  '--view',
  '--nolockcheck',
  '--nologo',
  '--norestore'
];

const INPUT_PATH = '/opt/lo.tar.br';
const OUTPUT_PATH = '/tmp/instdir/program/soffice';

// see https://github.com/alixaxel/chrome-aws-lambda
export async function getExecutablePath(): Promise<string> {
  return unpack({inputPath: INPUT_PATH, outputPath: OUTPUT_PATH});
}

/**
 * Converts a file in /tmp to the desired file format
 * @param {String} filename Name of the file to convert located in /tmp directory
 * @param {String} format File format to convert incoming file to
 * @return {Promise<String>} Absolute path to the converted file
 */
export async function convertTo(filename: string, format: string): Promise<string> {
  cleanupTempFiles();

  const binary = await getExecutablePath();

  const logs = execSync(
    `cd /tmp && ${binary} ${defaultArgs.join(' ')} --convert-to ${format} --outdir /tmp ${filename}`
  );

  execSync(`rm /tmp/${filename}`);
  cleanupTempFiles();

  return getConvertedFilePath(logs.toString('utf8'));
}

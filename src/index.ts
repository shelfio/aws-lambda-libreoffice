import {unpack} from '@shelf/aws-lambda-brotli-unpacker';
import {execSync} from 'child_process';
import {cleanupTempFiles} from './cleanup';

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

/**
 * Converts a file in /tmp to PDF
 * @param {String} filePath Absolute path to file to convert located in /tmp directory
 * @return {Promise<String>} Logs from spawning LibreOffice process
 */
export async function convertFileToPDF(filePath: string): Promise<string> {
  const binary = await getExecutablePath();

  const logs = execSync(
    `cd /tmp && ${binary} ${defaultArgs.join(' ')} --convert-to pdf --outdir /tmp ${filePath}`
  );

  execSync(`rm /tmp/${filePath}`);

  return logs.toString('utf8');
}

// see https://github.com/alixaxel/chrome-aws-lambda
export async function getExecutablePath(): Promise<string> {
  cleanupTempFiles();

  return unpack({inputPath: INPUT_PATH, outputPath: OUTPUT_PATH});
}

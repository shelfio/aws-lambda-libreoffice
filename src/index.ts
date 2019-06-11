import {unpack} from '@shelf/aws-lambda-brotli-unpacker';
import {execSync} from 'child_process';
import path from 'path';
import {cleanupTempFiles} from './cleanup';
import defaultArgsJSON from './args.json';

export const defaultArgs = defaultArgsJSON;

const inputPath = path.join(__dirname, '..', 'bin', 'lo.tar.br');
const outputPath = '/tmp/instdir/program/soffice';

/**
 * Converts a file in /tmp to PDF
 * @param {String} filePath Absolute path to file to convert located in /tmp directory
 * @return {Promise<String>} Logs from spawning LibreOffice process
 */
export async function convertFileToPDF(filePath): Promise<string> {
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

  return unpack({inputPath, outputPath});
}

import {execSync} from 'child_process';
import {basename} from 'path';
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
 * @param {Array} extensions List of LibreOffice extension paths (.oxt files)
 * @param {Boolean} shouldThrowOnExtensionFail Throw exceptions if extension was not loaded
 * @return {Promise<String>} Absolute path to the converted file
 */
export async function convertTo(
  filename: string,
  format: string,
  extensions: string[] = [],
  shouldThrowOnExtensionFail = true
): Promise<string> {
  let logs;
  cleanupTempFiles();
  await unpack({inputPath: INPUT_PATH});

  if (extensions.length) {
    const enabledExtensions = execSync(`${UNOPKG_OUTPUT_PATH} list --shared`);

    extensions.forEach(extension => {
      enableExtension(enabledExtensions, extension, shouldThrowOnExtensionFail);
    });
  }

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

function enableExtension(
  enabledExtensions: Buffer,
  extension: string,
  shouldThrowOnExtensionFail: boolean
) {
  if (!enabledExtensions.includes(basename(extension))) {
    try {
      execSync(`${UNOPKG_OUTPUT_PATH} add --shared ${extension}`);
    } catch (e) {
      if (shouldThrowOnExtensionFail) {
        throw e;
      }
    }
  }
}

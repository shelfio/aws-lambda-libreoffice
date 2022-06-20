import {basename} from 'path';
import {execSync} from 'child_process';

const UNOPKG_OUTPUT_PATH = '/opt/libreoffice7.3/program/unopkg.bin';

export function enableExtension(
  enabledExtensions: string,
  extension: string,
  shouldThrowOnExtensionFail: boolean
): void {
  if (enabledExtensions.includes(basename(extension))) {
    return;
  }

  try {
    execSync(`${UNOPKG_OUTPUT_PATH} add --shared ${extension}`);
  } catch (e) {
    if (shouldThrowOnExtensionFail) {
      throw e;
    }
  }
}

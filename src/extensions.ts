import {basename} from 'path';
import {execSync} from 'child_process';

const UNOPKG_OUTPUT_PATH = '/opt/libreoffice7.3/program/unopkg.bin';

export function enableAllExtensions(extensions: string[], shouldThrowOnExtensionFail = true): void {
  const enabledExtensions = execSync(`${UNOPKG_OUTPUT_PATH} list --shared`).toString();

  extensions.forEach(extension => {
    enableExtension(enabledExtensions, extension, shouldThrowOnExtensionFail);
  });
}

function enableExtension(
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

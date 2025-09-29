import {existsSync, mkdirSync, mkdtempSync} from 'node:fs';
import {promises as fsPromises} from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export const ensureDirectory = directory => {
  if (!existsSync(directory)) {
    mkdirSync(directory, {recursive: true});
  }
};

export const createTempDir = (prefix = 'lambda-fixtures-') => {
  const base = path.join(os.tmpdir(), prefix);
  const directory = mkdtempSync(base);
  ensureDirectory(directory);

  return directory;
};

export const removeDir = async directory => {
  await fsPromises.rm(directory, {recursive: true, force: true});
};

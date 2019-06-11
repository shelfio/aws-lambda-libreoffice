import fs from 'fs';
import del from 'del';

export function cleanupTempFiles() {
  for (let file of fs.readdirSync(`/tmp`)) {
    if (file.endsWith('.tmp') === true || file.startsWith('OSL_PIPE')) {
      try {
        del.sync([`/tmp/${file}`, `/tmp/${file}/*`], {force: true});
        // eslint-disable-next-line no-empty
      } catch (error) {}
    }
  }
}

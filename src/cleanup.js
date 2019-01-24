const fs = require('fs');
const del = require('del');

module.exports.cleanupTempFiles = function() {
  for (let file of fs.readdirSync(`/tmp`)) {
    if (file.endsWith('.tmp') === true || file.startsWith('OSL_PIPE')) {
      try {
        del.sync([`/tmp/${file}`, `/tmp/${file}/*`], {force: true});
        // eslint-disable-next-line no-empty
      } catch (error) {}
    }
  }
};

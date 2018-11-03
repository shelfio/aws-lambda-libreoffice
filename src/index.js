const {unpack} = require('@shelf/aws-lambda-brotli-unpacker');
const {execSync} = require('child_process');
const path = require('path');
const defaultArgs = require('./args');
const {cleanupTempFiles} = require('./cleanup');

module.exports.defaultArgs = defaultArgs;

const inputPath = path.join(__dirname, '..', 'bin', 'lo.tar.br');
const outputPath = '/tmp/instdir/program/soffice';

// see https://github.com/alixaxel/chrome-aws-lambda
module.exports.getExecutablePath = async function() {
  cleanupTempFiles();
  return unpack({inputPath, outputPath});
};

/**
 * Converts a file in /tmp to PDF
 * @param {String} filePath Absolute path to file to convert located in /tmp directory
 * @return {Promise<String>} Logs from spawning LibreOffice process
 */
module.exports.convertFileToPDF = async function(filePath) {
  const binary = await getExecutablePath();

  const logs = execSync(
    `cd /tmp && ${binary} ${defaultArgs.join(' ')} --convert-to pdf --outdir /tmp ${filePath}`
  );

  execSync(`rm ${filePath}`);

  return logs.toString('utf8');
};

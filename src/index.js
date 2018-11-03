const {unpack} = require('@shelf/aws-lambda-brotli-unpacker');
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

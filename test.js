/* eslint-disable @typescript-eslint/no-var-requires */
const {writeFileSync} = require('fs');
const {convertFileToPDF} = require('./lib');

module.exports.handler = async () => {
  writeFileSync('/tmp/test.txt', Buffer.from('Hello World!'));

  return convertFileToPDF('test.txt');
};

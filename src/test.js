const {writeFileSync} = require('fs');
const {convertFileToPDF} = require('./');

module.exports.handler = async () => {
  writeFileSync('/tmp/test.txt', Buffer.from('Hello World!'));

  return convertFileToPDF('test.txt');
};

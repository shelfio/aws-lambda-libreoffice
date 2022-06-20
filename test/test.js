/* eslint-disable @typescript-eslint/no-var-requires */
const {writeFileSync} = require('fs');
const {convertTo} = require('./lib');

module.exports.handler = () => {
  writeFileSync('/tmp/test.txt', Buffer.from('Hello World!'));

  const convertedFilePath = convertTo('test.txt', `pdf`);

  console.log({convertedFilePath});
};

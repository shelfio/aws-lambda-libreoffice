/* eslint-disable @typescript-eslint/no-var-requires */
const {writeFileSync} = require('fs');
const {convertTo} = require('./lib');

module.exports.handler = async () => {
  writeFileSync('/tmp/test.txt', Buffer.from('Hello World!'));

  const convertedFilePath = await convertTo('test.txt', `pdf`);

  console.log({convertedFilePath});
};

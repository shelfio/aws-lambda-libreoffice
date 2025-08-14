import {writeFileSync} from 'fs';
import {convertTo} from './lib/index.js';

export const handler = async () => {
  writeFileSync('/tmp/test.txt', Buffer.from('Hello World!'));

  const convertedFilePath = await convertTo('test.txt', `pdf`);

  console.log({convertedFilePath});
};

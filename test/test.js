import {writeFileSync} from 'fs';
import {convertTo} from './lib';

export const handler = async () => {
  writeFileSync('/tmp/test.txt', Buffer.from('Hello World!'));

  const convertedFilePath = await convertTo('test.txt', `pdf`);

  console.log({convertedFilePath});
};

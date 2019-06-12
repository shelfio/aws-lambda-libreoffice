import {getConvertedFilePath} from './logs';

describe('getConvertedFilePath', () => {
  it('should return converted file path', () => {
    const logsString = `\tconvert /tmp/test.txt -> /tmp/test.docx using filter : MS Word 2007 XML`;

    expect(getConvertedFilePath(logsString)).toEqual('/tmp/test.docx');
  });
});

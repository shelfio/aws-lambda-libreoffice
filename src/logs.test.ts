import {getConvertedFilePath} from './logs';

describe('getConvertedFilePath', () => {
  it('should return converted file path', () => {
    const logsString = `\tconvert /tmp/test.txt -> /tmp/test.docx using filter : MS Word 2007 XML`;

    expect(getConvertedFilePath(logsString)).toEqual('/tmp/test.docx');
  });

  it('should throw extended error message when passed incorrect format string', () => {
    const logsString = 'log string that produces error';

    expect(() => getConvertedFilePath(logsString)).toThrow(
      new Error(`No match found in logs;\tTried to parse string: "log string that produces error"`)
    );
  });
});

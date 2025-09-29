import {getConvertedFilePath} from '../../src/logs';
import {invalidConversionLog, successfulConversionLog} from './__fixtures__/logs';

describe('getConvertedFilePath', () => {
  it('should return converted file path', () => {
    expect(getConvertedFilePath(successfulConversionLog)).toEqual('/tmp/test.docx');
  });

  it('should throw extended error message when passed incorrect format string', () => {
    expect(() => getConvertedFilePath(invalidConversionLog)).toThrow(
      new Error(`No match found in logs;\tTried to parse string: "${invalidConversionLog}"`)
    );
  });
});

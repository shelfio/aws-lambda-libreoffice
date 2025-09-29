import {canBeConvertedToPDF} from '../../src/validations';
import {supportedFilenames, unsupportedFilenames} from './__fixtures__/filenames';

it.each(
  supportedFilenames.map(filename => {
    return {filename};
  })
)('should return true for supported filename $filename', ({filename}) => {
  expect(canBeConvertedToPDF(filename)).toEqual(true);
});

it.each(
  unsupportedFilenames.map(filename => {
    return {filename};
  })
)('should return false for unsupported filename $filename', ({filename}) => {
  expect(canBeConvertedToPDF(filename)).toEqual(false);
});

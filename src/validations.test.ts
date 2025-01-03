import {canBeConvertedToPDF} from './validations';

it.each`
  filename
  ${'image.docx'}
  ${'image.pdf'}
`('should return true for supported filename $filename', ({filename}) => {
  expect(canBeConvertedToPDF(filename)).toEqual(true);
});

it.each`
  filename
  ${'image.mpp'}
  ${'image.msg'}
  ${'image.jpg'}
  ${'image.mp4'}
  ${'image.mp3'}
  ${'image.wav'}
  ${'image.chm'}
  ${'image.gdoc'}
  ${'image.dwg'}
`('should return false for unsupported filename $filename', ({filename}) => {
  expect(canBeConvertedToPDF(filename)).toEqual(false);
});

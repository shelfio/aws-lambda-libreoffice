import {canBeConvertedToPDF} from './validations';

it.each`
  filename
  ${'document.docx'}
  ${'document.pdf'}
`('should return true for supported filename $filename', ({filename}) => {
  expect(canBeConvertedToPDF(filename)).toEqual(true);
});

it.each`
  filename
  ${'project.mpp'}
  ${'email.msg'}
  ${'image.jpg'}
  ${'video.mp4'}
  ${'audio.mp3'}
  ${'sound.wav'}
  ${'help.chm'}
  ${'google-doc.gdoc'}
  ${'drawing.dwg'}
`('should return false for unsupported filename $filename', ({filename}) => {
  expect(canBeConvertedToPDF(filename)).toEqual(false);
});

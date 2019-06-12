import {canBeConvertedToPDF} from './validations';

describe('canBeConvertedToPDF', () => {
  it.each`
    filename        | expected
    ${'image.jpg'}  | ${false}
    ${'image.mp4'}  | ${false}
    ${'image.mp3'}  | ${false}
    ${'image.wav'}  | ${false}
    ${'image.chm'}  | ${false}
    ${'image.docx'} | ${true}
    ${'image.pdf'}  | ${true}
  `('should return $expected for filename $filename', ({filename, expected}) => {
    expect(canBeConvertedToPDF(filename)).toEqual(expected);
  });
});

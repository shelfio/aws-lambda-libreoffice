import isAudio from '@shelf/is-audio-filepath';
import isVideo from 'is-video';
import isImage from 'is-image';

export function canBeConvertedToPDF(filename: string): boolean {
  filename = filename.toLowerCase();

  return (
    !isImage(filename) &&
    !isVideo(filename) &&
    !isAudio(filename) &&
    !filename.endsWith('.chm') &&
    !filename.endsWith('.gdoc') &&
    !filename.endsWith('.heic')
  );
}

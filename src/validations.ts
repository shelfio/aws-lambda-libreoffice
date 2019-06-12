import isAudio from '@shelf/is-audio-filepath';
import isVideo from 'is-video';
import isImage from 'is-image';

export function canBeConvertedToPDF(filename: string): boolean {
  return (
    !isImage(filename) && !isVideo(filename) && !isAudio(filename) && !filename.endsWith('.chm')
  );
}

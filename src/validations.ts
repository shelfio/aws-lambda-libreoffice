import isAudio from '@shelf/is-audio-filepath';
import isVideo from 'is-video';
import isImage from 'is-image';

const UNSUPPORTED_FILE_EXTENSIONS = ['.chm', '.heic', '.gdoc', '.gsheet', '.gslides', '.zip'];

export function canBeConvertedToPDF(filename: string): boolean {
  filename = filename.toLowerCase();

  const isFileExtensionUnsupported = UNSUPPORTED_FILE_EXTENSIONS.some(ext =>
    filename.endsWith(ext)
  );

  if (isFileExtensionUnsupported) {
    return false;
  }

  return !isImage(filename) && !isVideo(filename) && !isAudio(filename);
}

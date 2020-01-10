import tar from 'tar-fs';
import zlib from 'zlib';
import fs from 'fs';
import path from 'path';

// see https://github.com/alixaxel/chrome-aws-lambda
export function unpack({
  inputPath,
  outputBaseDir = `/tmp`,
  outputPath = `/tmp/instdir`
}): Promise<string> {
  return new Promise((resolve, reject) => {
    const input = path.resolve(inputPath);
    const output = outputPath;

    if (fs.existsSync(output) === true) {
      return resolve(output);
    }

    const source = fs.createReadStream(input);
    const target = tar.extract(outputBaseDir);

    source.on('error', error => {
      return reject(error);
    });

    target.on('error', error => {
      return reject(error);
    });

    target.on('finish', () => {
      fs.chmod(output, '0755', error => {
        if (error) {
          return reject(error);
        }

        return resolve(output);
      });
    });

    source.pipe(zlib.createBrotliDecompress()).pipe(target);
  });
}

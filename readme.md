# aws-lambda-libreoffice ![](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)

> 85 MB LibreOffice to fit inside AWS Lambda compressed with Brotli

Inspired by [chrome-aws-lambda](https://github.com/alixaxel/chrome-aws-lambda)

✨ Also works in [Google Cloud Functions](https://cloud.google.com/functions/) as long as you select [Node.js 8 runtime](https://cloud.google.com/functions/docs/concepts/nodejs-8-runtime) <sub>(thanks to [ncruces](https://github.com/ncruces) [for the info](https://github.com/vladgolubev/aws-lambda-libreoffice/issues/28#issuecomment-427397121))</sub>

:information_source: Compiled LibreOffice version: 6.1.0.0.alpha0

## Install

```
$ yarn add @shelf/aws-lambda-libreoffice
```

## Usage

```js
const {convertFileToPDF} = require('@shelf/aws-lambda-libreoffice');

module.exports.handler = async () => {
  // assuming there is a document.docx file inside /tmp dir
  // original file will be deleted afterwards

  return convertFileToPDF('/tmp/document.docx'); // will create /tmp/document.pdf
};
```

Or if you want more control:

```js
const {getExecutablePath, defaultArgs} = require('@shelf/aws-lambda-libreoffice');

const loBinary = await getExecutablePath(); // /tmp/instdir/program/soffice

execSync(`${loBinary} ${defaultArgs.join(' ')} --convert-to pdf file.docx --outdir /tmp`);
```

## See Also

- [serverless-libreoffice](https://github.com/vladgolubev/serverless-libreoffice)
- [aws-lambda-tesseract](https://github.com/shelfio/aws-lambda-tesseract)
- [aws-lambda-brotli-unpacker](https://github.com/shelfio/aws-lambda-brotli-unpacker)
- [chrome-aws-lambda](https://github.com/alixaxel/chrome-aws-lambda)

### Test

Smoke test that it works: `yarn build && docker run --rm -v "$PWD":/var/task lambci/lambda:nodejs8.10 lambda.test.handler`

## License

MIT © [Shelf](https://shelf.io)

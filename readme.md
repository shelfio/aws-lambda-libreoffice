# aws-lambda-libreoffice ![](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)

> 85 MB LibreOffice to fit inside AWS Lambda compressed with Brotli

Inspired by [chrome-aws-lambda](https://github.com/alixaxel/chrome-aws-lambda)

✨ Also works in [Google Cloud Functions](https://cloud.google.com/functions/) as long as you select [Node.js 8 runtime](https://cloud.google.com/functions/docs/concepts/nodejs-8-runtime) <sub>(thanks to [ncruces](https://github.com/ncruces) [for the info](https://github.com/vladgolubev/aws-lambda-libreoffice/issues/28#issuecomment-427397121))</sub>

## Install

```
$ yarn add aws-lambda-libreoffice
```

## Usage

```js
const {getExecutablePath, defaultArgs} = require('aws-lambda-libreoffice');

const loBinary = await getExecutablePath(); // /tmp/instdir/program/soffice

execSync(`${loBinary} ${defaultArgs.join(' ')} --convert-to pdf file.docx --outdir /tmp`)
```

## License

MIT © [Vlad Holubiev](https://vladholubiev.com)

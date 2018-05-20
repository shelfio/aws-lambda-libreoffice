# aws-lambda-libreoffice ![](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)

> 85 MB LibreOffice to fit inside AWS Lambda compressed with Brotli

Inspired by [chrome-aws-lambda](https://github.com/alixaxel/chrome-aws-lambda)

## Install

```
$ yarn add aws-lambda-libreoffice
```

## Usage

```js
const {getExecutablePath, defaultArgs} = require('aws-lambda-libreoffice');

const loBinary = await getExecutablePath(); // /tmp/instdir/program/soffice

execSync(`${loBinary} ${defaultArgs} --convert-to pdf file.docx`)
```

## License

MIT © [Vlad Holubiev](https://vladholubiev.com)

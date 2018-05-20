# aws-lambda-libreoffice [![CircleCI](https://img.shields.io/circleci/project/github/vladgolubev/aws-lambda-libreoffice.svg)](https://circleci.com/gh/vladgolubev/aws-lambda-libreoffice) ![](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)

> 85 MB LibreOffice to fit inside AWS Lambda compressed with Brotli

## Install

```
$ yarn add aws-lambda-libreoffice
```

## Usage

```js
const {executablePath} = require('aws-lambda-libreoffice');

const loBinary = await executablePath(); // /tmp/instdir/program/soffice

execSync(`${loBinary} --headless --convert-to pdf file.docx`)
```

## License

MIT © [Vlad Holubiev](https://vladholubiev.com)

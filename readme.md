# aws-lambda-libreoffice [![CircleCI](https://img.shields.io/circleci/project/github/vladgolubev/aws-lambda-libreoffice.svg)](https://circleci.com/gh/vladgolubev/aws-lambda-libreoffice) ![](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)

> Compressed LibreOffice for AWS Lambda

## Install

```
$ yarn add aws-lambda-libreoffice
```

## Usage

```js
const {executablePath} = require('aws-lambda-libreoffice');

const loBinary = await executablePath(); // /tmp/instdir/program/soffice
```

## API

### awsLambdaLibreoffice(input, [options])

#### input

Type: `string`

Lorem ipsum.

#### options

##### foo

Type: `boolean`<br>
Default: `false`

Lorem ipsum.

## License

MIT © [Vlad Holubiev](https://vladholubiev.com)

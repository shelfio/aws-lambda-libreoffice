# aws-lambda-libreoffice ![](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)

> Utility to work with Docker version of LibreOffice in Lambda

## Install

```
$ yarn add @shelf/aws-lambda-libreoffice
```

## Usage (For version 4.x; based on a Lambda Docker Image)

This version requires Node 16.x or higher. It also includes CJK fonts bundled.

First, you need to create a Docker image for your Lambda function. See the example at [libreoffice-lambda-base-image](https://github.com/shelfio/libreoffice-lambda-base-image) repo.

Example:

```Dockerfile
FROM public.ecr.aws/shelf/lambda-libreoffice-base:7.3-node16-x86_64

COPY ./ ${LAMBDA_TASK_ROOT}/

RUN yarn install

CMD [ "handler.handler" ]
```

Given you have packaged your Lambda function as a Docker image, you can now use this package:

```javascript
const {convertTo, canBeConvertedToPDF} = require('@shelf/aws-lambda-libreoffice');

module.exports.handler = async () => {
  // assuming there is a document.docx file inside /tmp dir
  // original file will be deleted afterwards

  if (!canBeConvertedToPDF('document.docx')) {
    return false;
  }

  return convertTo('document.docx', 'pdf'); // returns /tmp/document.pdf
};
```

## Usage (For version 3.x; based on a Lambda Layer)

This version requires Node 12.x or higher.

**NOTE:** Since version 2.0.0 npm package no longer ships the 85 MB LibreOffice
but relies upon [libreoffice-lambda-layer](https://github.com/shelfio/libreoffice-lambda-layer) instead.
Follow the instructions on how to add a lambda layer in [that repo](https://github.com/shelfio/libreoffice-lambda-layer).

```js
const {convertTo, canBeConvertedToPDF} = require('@shelf/aws-lambda-libreoffice');

module.exports.handler = async () => {
  // assuming there is a document.docx file inside /tmp dir
  // original file will be deleted afterwards

  if (!canBeConvertedToPDF('document.docx')) {
    return false;
  }

  return convertTo('document.docx', 'pdf'); // returns /tmp/document.pdf
};
```

Or if you want more control:

```js
const {unpack, defaultArgs} = require('@shelf/aws-lambda-libreoffice');

await unpack(); // default path /tmp/instdir/program/soffice.bin

execSync(
  `/tmp/instdir/program/soffice.bin ${defaultArgs.join(
    ' '
  )} --convert-to pdf file.docx --outdir /tmp`
);
```

## Troubleshooting

- Please allocate at least **1536 MB** of RAM for your Lambda function.
- It works only in Amazon Linux 2, so it won't work locally on Linux or macOS. However, you could run it in Docker using `lambci/lambda:nodejs12.x` image
- If some file fails to be converted to PDF, try converting it to PDF on your computer first. This might be an issue with LibreOffice itself

## See Also

- [libreoffice-lambda-base-image](https://github.com/shelfio/libreoffice-lambda-base-image) - a base Docker image for you Lambdas
- [libreoffice-lambda-layer](https://github.com/shelfio/libreoffice-lambda-layer) - deprecated, not updated anymore, used the Docker image above
- [serverless-libreoffice](https://github.com/vladgolubev/serverless-libreoffice) - original implementation
- [aws-lambda-tesseract](https://github.com/shelfio/aws-lambda-tesseract)
- [aws-lambda-brotli-unpacker](https://github.com/shelfio/aws-lambda-brotli-unpacker)
- [chrome-aws-lambda](https://github.com/alixaxel/chrome-aws-lambda)

## Test

Beside unit tests that could be run via `yarn test`, there are integration tests.
Smoke test that it works: `./test/test.sh`.

## Publish

```sh
$ git checkout master
$ yarn version
$ yarn publish
$ git push origin master --tags
```

## License

MIT © [Shelf](https://shelf.io)

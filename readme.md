# aws-lambda-libreoffice ![](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)

> Utility to work with Docker version of LibreOffice in Lambda

## Install

```
$ yarn add @shelf/aws-lambda-libreoffice
```

## Features

- Includes CJK and X11 fonts bundled in the [base Docker image](https://github.com/shelfio/libreoffice-lambda-base-image)!
- Relies on the latest LibreOffice 7.4 version which is not stripped down from features as a previous layer-based version of this package
- Requires node.js 16x runtime (x86_64)

## Requirements

### Lambda Docker Image

First, you need to create a Docker image for your Lambda function.
See the example at [libreoffice-lambda-base-image](https://github.com/shelfio/libreoffice-lambda-base-image) repo.

Example:

```Dockerfile
FROM public.ecr.aws/shelf/lambda-libreoffice-base:7.6-node18-x86_64

COPY ./ ${LAMBDA_TASK_ROOT}/

RUN yarn install

CMD [ "handler.handler" ]
```

### Lambda Configuration

- At least 3008 MB of RAM is recommended
- At least 45 seconds of Lambda timeout is necessary
- For larger files support, you can [extend Lambda's /tmp space](https://aws.amazon.com/blogs/aws/aws-lambda-now-supports-up-to-10-gb-ephemeral-storage/) using the `ephemeral-storage` parameter
- Set environment variable `HOME` to `/tmp`

## Usage (For version 4.x; based on a Lambda Docker Image)

Given you have packaged your Lambda function as a Docker image, you can now use this package:

```javascript
const {convertTo, canBeConvertedToPDF} = require('@shelf/aws-lambda-libreoffice');

module.exports.handler = async () => {
  // assuming there is a document.docx file inside /tmp dir
  // original file will be deleted afterwards

  // it is optional to invoke this function, you can skip it if you're sure about file format
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

- Please allocate at least **3008 MB** of RAM for your Lambda function.
- If some file fails to be converted to PDF, try converting it to PDF on your computer first. This might be an issue with LibreOffice itself
  - If you want to include some fonts/plugins to the libreoffice, contribute to the [libreoffice-lambda-base-image](https://github.com/shelfio/libreoffice-lambda-base-image) instead

## See Also

- [libreoffice-lambda-base-image](https://github.com/shelfio/libreoffice-lambda-base-image) - a base Docker image for you Lambdas
- [libreoffice-lambda-layer](https://github.com/shelfio/libreoffice-lambda-layer) - deprecated, not updated anymore, used the Docker image above
- [serverless-libreoffice](https://github.com/vladgolubev/serverless-libreoffice) - original implementation
- [aws-lambda-tesseract](https://github.com/shelfio/aws-lambda-tesseract)
- [aws-lambda-brotli-unpacker](https://github.com/shelfio/aws-lambda-brotli-unpacker)
- [chrome-aws-lambda](https://github.com/alixaxel/chrome-aws-lambda)

## Test

Beside unit tests that could be run via `yarn test`, there are integration tests.

Smoke test that it works:

```sh
cd test
./test.sh

# copy converted PDF file from container to the host to see if it's ok
export CID=$(cat ./cid)
docker cp $CID:/tmp/test.pdf ./test.pdf
```

## Publish

```sh
$ git checkout master
$ yarn version
$ yarn publish
$ git push origin master --tags
```

## License

MIT © [Shelf](https://shelf.io)

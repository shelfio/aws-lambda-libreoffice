# aws-lambda-libreoffice ![](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)

> Utility to work with Docker version of LibreOffice in Lambda

## Install

```
$ pnpm add @shelf/aws-lambda-libreoffice
```

## Features

- **ESM Module Support**: Native ESM package with full TypeScript support
- Includes CJK and X11 fonts bundled in the [base Docker image](https://github.com/shelfio/libreoffice-lambda-base-image)!
- Relies on the latest LibreOffice 7.6 version which is not stripped down from features
- Requires Node.js 22 or higher (x86_64)

## Requirements

### Lambda Docker Image

First, you need to create a Docker image for your Lambda function.
See the example at [libreoffice-lambda-base-image](https://github.com/shelfio/libreoffice-lambda-base-image) repo.

Example:

```Dockerfile
FROM public.ecr.aws/shelf/lambda-libreoffice-base:7.6-node20-x86_64

COPY ./ ${LAMBDA_TASK_ROOT}/

RUN pnpm install

CMD [ "handler.handler" ]
```

### Lambda Configuration

- At least 3008 MB of RAM is recommended
- At least 45 seconds of Lambda timeout is necessary
- For larger files support, you can [extend Lambda's /tmp space](https://aws.amazon.com/blogs/aws/aws-lambda-now-supports-up-to-10-gb-ephemeral-storage/) using the `ephemeral-storage` parameter
- Set environment variable `HOME` to `/tmp`

## Usage (ESM)

This package is now a native ESM module. If you're using CommonJS, you'll need to use dynamic imports or update your project to use ESM.

### ESM Usage (Recommended)

```javascript
import {convertTo, canBeConvertedToPDF} from '@shelf/aws-lambda-libreoffice';

export const handler = async () => {
  // assuming there is a document.docx file inside /tmp dir
  // original file will be deleted afterwards

  // it is optional to invoke this function, you can skip it if you're sure about file format
  if (!canBeConvertedToPDF('document.docx')) {
    return false;
  }

  return convertTo('document.docx', 'pdf'); // returns /tmp/document.pdf
};
```

### CommonJS Usage (via dynamic import)

```javascript
module.exports.handler = async () => {
  const {convertTo, canBeConvertedToPDF} = await import('@shelf/aws-lambda-libreoffice');

  if (!canBeConvertedToPDF('document.docx')) {
    return false;
  }

  return convertTo('document.docx', 'pdf'); // returns /tmp/document.pdf
};
```

## Troubleshooting

- Please allocate at least **3008 MB** of RAM for your Lambda function.
- If some file fails to be converted to PDF, try converting it to PDF on your computer first. This might be an issue with LibreOffice itself
  - If you want to include some fonts/plugins to the libreoffice, contribute to the [libreoffice-lambda-base-image](https://github.com/shelfio/libreoffice-lambda-base-image) instead

## See Also

- [libreoffice-lambda-base-image](https://github.com/shelfio/libreoffice-lambda-base-image) - a base Docker image for your Lambdas
- [serverless-libreoffice](https://github.com/vladgolubev/serverless-libreoffice) - original implementation
- [aws-lambda-tesseract](https://github.com/shelfio/aws-lambda-tesseract)
- [aws-lambda-brotli-unpacker](https://github.com/shelfio/aws-lambda-brotli-unpacker)
- [chrome-aws-lambda](https://github.com/alixaxel/chrome-aws-lambda)

## Test

The repository now ships two Jest suites and a standalone Lambda harness.

### Jest suites

- `pnpm test:unit` (or `pnpm test`) – runs unit tests in `tests/unit`
- `pnpm test:integration` – spins up the Lambda container through Jest; automatically skips if Podman or the base image is unavailable
- `pnpm test:e2e` – alias for the current integration suite

### Lambda harness

Use `pnpm test:lambda` to exercise the runtime end-to-end. The script bundles the handler, builds a disposable image on top of `libreoffice-lambda-base:local`, starts the Lambda runtime with Podman, invokes it once, and streams the conversion summary plus the temp output directory.

Requirements:

- `podman` installed locally
- A base image tagged `libreoffice-lambda-base:local` (override with `LIBREOFFICE_LAMBDA_BASE_IMAGE`)
- `pnpm build` completed beforehand (generates `lib/index.js` consumed by the bundler)

Handy workflow:

```sh
pnpm build
pnpm test:lambda -- --cleanup
```

`--cleanup` deletes the generated fixture output once you are done inspecting it. Additional flags like `--bundle`, `--fixtures`, and `--port` are available for custom runs; see `scripts/run-lambda-integration.mjs` for the full list.

## Publish

```sh
$ git checkout master
$ yarn version
$ yarn publish
$ git push origin master --tags
```

## License

MIT © [Shelf](https://shelf.io)

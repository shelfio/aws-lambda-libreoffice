#!/usr/bin/env bash

cd ../libreoffice-lambda-layer

rm -rf layer
unzip layer.zip -d layer

cd layer
brotli -d lo.tar.br
tar -xvf lo.tar

cd ../../aws-lambda-libreoffice/

yarn build
docker run --rm \
  -v "$PWD":/var/task \
  -v "$PWD"/../libreoffice-lambda-layer/layer:/opt \
  lambci/lambda:nodejs8.10 test.handler

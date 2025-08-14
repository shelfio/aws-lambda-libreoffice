#!/usr/bin/env bash

# Build the ESM code to CommonJS for Lambda compatibility
echo "Building Lambda handler with esbuild..."
cp -r ../lib ./
node build-for-lambda.js

# Copy the transpiled file to the root for the Dockerfile
cp ./dist/test.js ./test-bundled.js

podman build --platform linux/amd64 -t lo-lambda-test .

(sleep 7; curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{"payload":"hello world!"}') &
(sleep 30; CID=$(cat ./cid) && podman stop $CID && rm ./cid) &

podman run --platform linux/amd64 -p 9000:8080 --rm --cidfile ./cid lo-lambda-test

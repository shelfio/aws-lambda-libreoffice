#!/usr/bin/env bash

# Build the ESM code to CommonJS for Lambda compatibility
echo "Building Lambda handler with esbuild..."
cp -r ../lib ./
node build-for-lambda.js

# Copy the transpiled file to the root for the Dockerfile
cp ./dist/test.js ./test-bundled.js

podman build --platform linux/amd64 -t lo-lambda-test .

# Ensure test-data directory exists
mkdir -p ./test-data

# Run container with volume mount for test-data
echo "Starting container with volume mount for test-data..."
echo "Input files in test-data:"
ls -la test-data/

CONTAINER_NAME="lo-lambda-test-$(date +%s)"

# Invoke the Lambda function after a delay
(sleep 7; curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{"payload":"batch conversion"}') &

# Stop after 30 seconds
(sleep 30; podman stop ${CONTAINER_NAME}) &

# Mount the test-data directory for both input and output
podman run --platform linux/amd64 \
  -p 9000:8080 \
  --name ${CONTAINER_NAME} \
  -v $(pwd)/test-data:/tmp/test-data:Z \
  --rm \
  lo-lambda-test

echo ""
echo "=== Conversion Complete ==="
echo "Generated PDFs in test-data:"
ls -la test-data/*.pdf 2>/dev/null || echo "No PDFs generated"

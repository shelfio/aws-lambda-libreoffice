ARG BASE_IMAGE=libreoffice-lambda-base:local
FROM ${BASE_IMAGE}

COPY dist/lambda/handler.cjs ${LAMBDA_TASK_ROOT}/test.js
COPY tests/integration/lambda/__fixtures__/documents ${LAMBDA_TASK_ROOT}/fixtures

ENV TEST_INPUT_DIR=${LAMBDA_TASK_ROOT}/fixtures
ENV TEST_OUTPUT_DIR=/tmp/test-data

CMD ["test.handler"]

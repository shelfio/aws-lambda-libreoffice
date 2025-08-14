FROM public.ecr.aws/shelf/lambda-libreoffice-base:7.6-node20-x86_64

COPY test-bundled.js ${LAMBDA_TASK_ROOT}/test.js
COPY test-data ${LAMBDA_TASK_ROOT}/test-data
CMD [ "test.handler" ]

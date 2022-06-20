#!/usr/bin/env bash

cp -r ../lib ./
cp -r ../node_modules ./
docker build -t lo-lambda-test .

(sleep 7; curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{"payload":"hello world!"}') &
(sleep 30; CID=$(cat ./cid) && docker stop $CID && rm ./cid) &

docker run -p 9000:8080 --rm --cidfile ./cid lo-lambda-test

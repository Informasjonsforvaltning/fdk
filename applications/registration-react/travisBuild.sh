#!/usr/bin/env bash
set -e

SECONDS=0 # start timer

echo "Install dependencies"
npm install

echo "SECONDS"
echo $SECONDS

echo "Run tests"
npm test

echo "SECONDS"
echo $SECONDS


if [ "$COVERALLS_REPO_TOKEN" ]
then
    echo "Report coverage"
    npm run coverage
fi


echo "SECONDS"
echo $SECONDS

echo "Start build in docker image";
docker build -t dcatno/registration-react:latest .

echo "SECONDS"
echo $SECONDS

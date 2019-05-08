#!/usr/bin/env bash
set -e

SECONDS=0 # start timer

echo "Start build in docker image";
docker build -t dcatno/fuseki:latest .

echo "SECONDS"
echo $SECONDS

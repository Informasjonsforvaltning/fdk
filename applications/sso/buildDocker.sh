#!/usr/bin/env bash
set -e

SECONDS=0 # start timer

echo "Start build libraries/keycloak-user-storage-rest";

(cd modules/rest-user-mapper && mvn clean package)
cp modules/rest-user-mapper/target/rest-user-mapper.jar deployments/

echo "SECONDS"
echo $SECONDS

echo "Start build in docker image";
docker build -t dcatno/sso:latest .

echo "SECONDS"
echo $SECONDS

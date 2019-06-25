#!/usr/bin/env bash
set -e

SECONDS=0 # start timer

echo "Start build libraries/keycloak-user-storage-rest";

(cd ../.. && mvn clean package -B -T 2C --projects libraries/keycloak-user-storage-rest --also-make)
cp ../../libraries/keycloak-user-storage-rest/target/keycloak-user-storage-rest.jar deployments/

echo "SECONDS"
echo $SECONDS

echo "Start build in docker image";
docker build -t dcatno/sso:latest .

echo "SECONDS"
echo $SECONDS

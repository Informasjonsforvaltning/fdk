#!/usr/bin/env bash
set -e


echo "Preparing to push 'registrering-gui' to docker"

docker login --username ${dockerUsername} --password ${dockerPassword}

docker push dcatno/registration:latest
docker push dcatno/nginx:latest

# tag with commit ID and push so that we can easily roll back if needed
docker tag dcatno/registration:latest dcatno/registration:GIT_${TRAVIS_COMMIT}
docker push dcatno/registration:GIT_${TRAVIS_COMMIT}

docker tag dcatno/nginx:latest dcatno/registration:GIT_${TRAVIS_COMMIT}
docker push dcatno/nginx:GIT_${TRAVIS_COMMIT}


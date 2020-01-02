#!/usr/bin/env bash

i=0

docker_apps="e2e search registration-react fuseki nginx-registration nginx-enhetsregisteret-proxy"

for docker_app in $docker_apps; do
    i=$((i+1))
    BUILD_APPS[$i]=$docker_app
    BUILD_CMD[$i]="( cd applications/$docker_app && ./buildDocker.sh )"
done

export BUILD_APPS
export BUILD_CMD

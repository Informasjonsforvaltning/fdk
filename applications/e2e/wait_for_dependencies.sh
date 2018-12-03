#!/usr/bin/env bash

__dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

HOST_SEARCH=${HOST_SEARCH:-http://localhost:8080}

dependencies="$HOST_SEARCH/metrics/apis/readiness $HOST_SEARCH/metrics/reference-data/readiness"

echo "Wait for dependencies: " $dependencies

source ${__dir}/scripts/wait_for_all.sh $dependencies

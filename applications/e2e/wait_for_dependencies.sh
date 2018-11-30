#!/usr/bin/env bash

HOST_SEARCH=${HOST_SEARCH:-http://localhost:8080}

dependencies="$HOST_SEARCH/metrics/apis/readiness $HOST_SEARCH/metrics/reference-data/readiness"

echo dependencies: $dependencies
__dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

source ${__dir}/scripts/wait_for_all.sh $dependencies

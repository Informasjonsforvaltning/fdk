#!/usr/bin/env bash

__dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Start waiting for all :" $@

for address in "$@"; do
    source ${__dir}/wait_for_http_200.sh $address
done
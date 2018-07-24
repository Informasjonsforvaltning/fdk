#!/usr/bin/env bash
set -e

hash=$(${BASH_SOURCE%/*}/calculateApplicationHash.sh)

echo "integration-$hash"

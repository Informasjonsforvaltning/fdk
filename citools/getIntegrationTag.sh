#!/usr/bin/env bash
set -e

# example
# echo $(INTEGRATION_APPS="search" ./citools/getIntegrationTag.sh)

hash=$(${BASH_SOURCE%/*}/calculateApplicationsHash.sh "$INTEGRATION_APPS")

echo "integration-$hash"

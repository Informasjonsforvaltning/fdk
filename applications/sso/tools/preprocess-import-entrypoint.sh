#!/bin/bash

ESCAPED_IDPORTEN_OIDC_ROOT=${IDPORTEN_OIDC_ROOT//\//\\\/}

echo "Processing import template"
echo "IDPORTEN_OIDC_ROOT=$IDPORTEN_OIDC_ROOT"
echo "ESCAPED_IDPORTEN_OIDC_ROOT=$ESCAPED_IDPORTEN_OIDC_ROOT"
echo "IDPORTEN_CLIENT_ID=$IDPORTEN_CLIENT_ID"

sed -e 's/${IDPORTEN_CLIENT_ID}/'$IDPORTEN_CLIENT_ID'/g' \
 -e 's/${IDPORTEN_CLIENT_SECRET}/'$IDPORTEN_CLIENT_SECRET'/g' \
 -e 's/${IDPORTEN_OIDC_ROOT}/'$ESCAPED_IDPORTEN_OIDC_ROOT'/g' \
  </tmp/keycloak/import-template/fdk-realm.template.json >/tmp/keycloak/import/fdk-realm.json

exec /opt/jboss/tools/docker-entrypoint.sh $@
exit $?

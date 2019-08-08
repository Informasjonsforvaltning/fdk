#!/bin/bash

__dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Processing import template"
echo "IDPORTEN_OIDC_ROOT=$IDPORTEN_OIDC_ROOT"
echo "IDPORTEN_CLIENT_ID=$IDPORTEN_CLIENT_ID"


OIDC_CONF_ADDRESS=$IDPORTEN_OIDC_ROOT/.well-known/openid-configuration

source ${__dir}/wait_for_http_200.sh $OIDC_CONF_ADDRESS

OIDC_CONF=$(curl $OIDC_CONF_ADDRESS)

if [ -z "$OIDC_CONF" ]
then
    echo "Error fetching ID-porten openid-configuration"
    exit 1
fi

IDPORTEN_OIDC_ISSUER=$(echo $OIDC_CONF | jq ".issuer" -r)
IDPORTEN_OIDC_AUTHORIZATION_URL=$(echo $OIDC_CONF | jq ".authorization_endpoint" -r)
IDPORTEN_OIDC_TOKEN_URL=$(echo $OIDC_CONF | jq ".token_endpoint" -r)
IDPORTEN_OIDC_JWKS_URL=$(echo $OIDC_CONF | jq ".jwks_uri" -r)

sed -e 's,${IDPORTEN_CLIENT_ID},'$IDPORTEN_CLIENT_ID',g' \
 -e 's,${IDPORTEN_CLIENT_SECRET},'$IDPORTEN_CLIENT_SECRET',g' \
 -e 's,${IDPORTEN_OIDC_ISSUER},'$IDPORTEN_OIDC_ISSUER',g' \
 -e 's,${IDPORTEN_OIDC_AUTHORIZATION_URL},'$IDPORTEN_OIDC_AUTHORIZATION_URL',g' \
 -e 's,${IDPORTEN_OIDC_TOKEN_URL},'$IDPORTEN_OIDC_TOKEN_URL',g' \
 -e 's,${IDPORTEN_OIDC_JWKS_URL},'$IDPORTEN_OIDC_JWKS_URL',g' \
  </tmp/keycloak/import-template/fdk-realm.template.json >/tmp/keycloak/import/fdk-realm.json

exec /opt/jboss/tools/docker-entrypoint.sh $@
exit $?

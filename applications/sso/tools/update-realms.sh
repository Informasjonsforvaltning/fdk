#!/bin/bash
export PATH=$PATH:$JBOSS_HOME/bin

# Note: 'update realms/<realm>' updates realm-attributes and 'create partialImport -r <realm>' updates idp, clients and roles
# Authentication flows and executions is not covered and is therefore handled by import-realm-and-authentication.py

/opt/fdk/tools/import-realm-and-authentication.py

kcadm.sh config credentials --server http://localhost:8084/auth --realm master --user $KEYCLOAK_USER --password $KEYCLOAK_PASSWORD

kcadm.sh update realms/fdk-local -f /tmp/keycloak/import/update/fdk-local-realm.json
kcadm.sh create partialImport -r fdk-local -s ifResourceExists=OVERWRITE -o -f /tmp/keycloak/import/update/fdk-local-realm.json

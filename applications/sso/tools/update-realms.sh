#!/bin/bash
export PATH=$PATH:$JBOSS_HOME/bin

# Note: 'update realms/<realm>' updates realm-attributes and 'create partialImport -r <realm>' updates idp, clients and roles
# Authentication flows and executions is not covered and is therefore handled by update-authentication.py

/opt/fdk/tools/update-authentication.py

kcadm.sh config credentials --server http://localhost:8084/auth --realm master --user $KEYCLOAK_USER --password $KEYCLOAK_PASSWORD

kcadm.sh update realms/fdk -f /tmp/keycloak/import/fdk-realm.json
kcadm.sh create partialImport -r fdk -s ifResourceExists=OVERWRITE -o -f /tmp/keycloak/import/fdk-realm.json

kcadm.sh update realms/idporten-mock -f /tmp/keycloak/import/idporten-mock-realm.json
kcadm.sh create partialImport -r idporten-mock -s ifResourceExists=OVERWRITE -o -f /tmp/keycloak/import/idporten-mock-realm.json

kcadm.sh update realms/fdk-local -f /tmp/keycloak/import/fdk-local-realm.json
kcadm.sh create partialImport -r fdk-local -s ifResourceExists=OVERWRITE -o -f /tmp/keycloak/import/fdk-local-realm.json

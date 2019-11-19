#!/bin/bash
export PATH=$PATH:$JBOSS_HOME/bin

# Note: Not everything will be updated with this script, some attributes are still ignored, i.e. identity-provider-mappers.
# The python-script should be expanded if these attributes needs to be updated.

# The script 'import-realm-and-authentication.py' creates the realm if it's missing and then updates authentication attributes.

# The two kcadm methods, 'update realms/<realm>' and 'create partialImport -r <realm>', is able to update some, but not all, keycloak attributes.

/opt/fdk/tools/import-realm-and-authentication.py

kcadm.sh config credentials --server http://localhost:8084/auth --realm master --user $KEYCLOAK_USER --password $KEYCLOAK_PASSWORD

kcadm.sh update realms/fdk-local -f /tmp/keycloak/import/update/fdk-local-realm.json
kcadm.sh create partialImport -r fdk-local -s ifResourceExists=OVERWRITE -o -f /tmp/keycloak/import/update/fdk-local-realm.json

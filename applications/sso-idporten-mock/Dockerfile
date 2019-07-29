FROM jboss/keycloak:6.0.1

COPY import /tmp/keycloak/import

CMD ["-b", "0.0.0.0", "-Dkeycloak.migration.action=import", "-Dkeycloak.migration.provider=dir", "-Dkeycloak.migration.dir=/tmp/keycloak/import", "-Dkeycloak.migration.strategy=OVERWRITE_EXISTING"]

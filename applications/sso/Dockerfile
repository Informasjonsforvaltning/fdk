FROM jboss/keycloak:6.0.1

ENV DB_VENDOR h2

COPY tools /opt/fdk/tools

# SSO service does not have permanent database.
# On service (re)start we will restore the database from the previously exported state.
# Normally (other than dev environments) don't have any static import files, so this directory is just a
# target directory placeholder for preprocessed templates
COPY import /tmp/keycloak/import

# Template files for generating import files. Templates have environment variable placeholders.
COPY import-template /tmp/keycloak/import-template

# Allow script user write generated imports
USER root
RUN chmod o+w /tmp/keycloak/import
USER 1000

ENTRYPOINT [ "/opt/fdk/tools/preprocess-import-entrypoint.sh" ]

CMD ["-b", "0.0.0.0", "-Dkeycloak.migration.action=import", "-Dkeycloak.migration.provider=dir", "-Dkeycloak.migration.dir=/tmp/keycloak/import", "-Dkeycloak.migration.strategy=OVERWRITE_EXISTING"]

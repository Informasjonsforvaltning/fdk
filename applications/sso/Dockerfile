FROM jboss/keycloak:6.0.1

ENV DB_VENDOR h2

# 1. copy keycloak theme as fdk theme.
RUN cp -r /opt/jboss/keycloak/themes/keycloak /opt/jboss/keycloak/themes/fdk
RUN cp -r /opt/jboss/keycloak/themes/keycloak /opt/jboss/keycloak/themes/fdk-choose-provider

# 2. copy modified files from host ( 3 files) - trying to copy only changed files...
COPY themes/fdk /opt/jboss/keycloak/themes/fdk
COPY themes/fdk-choose-provider /opt/jboss/keycloak/themes/fdk-choose-provider

COPY tools /opt/fdk/tools

# deployments are compiled SPI implementation modules. E.g. Federated rest user storage module.
COPY deployments /opt/jboss/keycloak/standalone/deployments

# On service (re)start the stored keycloak state will be compared with the previously exported state, missing components will be restored.
# The restoration of the realms are ignored during startup if they already exist, an update script is run after startup to ensure they are completely up to date.
# When exporting state, it needs to be converted to a template file that has environment variable placeholders in it
# If needed (in dev environment) additional static realms can be included in imports.
COPY import /tmp/keycloak/import
COPY startup-scripts /opt/jboss/startup-scripts
COPY import-template /tmp/keycloak/import-template
USER root
RUN chmod o+w /tmp/keycloak/import/update
RUN chmod o+w /tmp/keycloak/import/overwrite
USER 1000

ENTRYPOINT [ "/opt/fdk/tools/preprocess-import-entrypoint.sh" ]

# port offset 4 is set because we want the server to be accessible both from host and from the sso container in local network claster.
# host name is made available by specifying it in the hosts file in host machine.
# port offset will cause changing port to 8084 which will be the same as exposed port to host.

CMD ["-b", "0.0.0.0", "-Dkeycloak.migration.action=import", "-Dkeycloak.migration.provider=dir", "-Dkeycloak.migration.dir=/tmp/keycloak/import/overwrite", "-Dkeycloak.migration.strategy=OVERWRITE_EXISTING", "-Djboss.socket.binding.port-offset=4"]

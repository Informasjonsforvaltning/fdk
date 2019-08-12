FROM jboss/keycloak:6.0.1

ENV DB_VENDOR h2

COPY tools /opt/fdk/tools

# SSO service does not have permanent database.
# On service (re)start we will restore the database from the previously exported state.
# When exporting state, it needs to be converted to a template file that has environment variable placeholders in it
# If needed (in dev environment) additional static realms can be included in imports.
COPY import /tmp/keycloak/import
COPY import-template /tmp/keycloak/import-template
USER root
RUN chmod o+w /tmp/keycloak/import
USER 1000

ENTRYPOINT [ "/opt/fdk/tools/preprocess-import-entrypoint.sh" ]

# port offset 4 is set because we want the server to be accessible both from host and from the sso container in local network claster.
# host name is made available by specifying it in the hosts file in host machine.
# port offset will cause changing port to 8084 which will be the same as exposed port to host.

CMD ["-b", "0.0.0.0", "-Dkeycloak.migration.action=import", "-Dkeycloak.migration.provider=dir", "-Dkeycloak.migration.dir=/tmp/keycloak/import", "-Dkeycloak.migration.strategy=OVERWRITE_EXISTING", "-Djboss.socket.binding.port-offset=4"]

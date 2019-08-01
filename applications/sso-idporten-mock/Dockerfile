FROM jboss/keycloak:6.0.1

COPY import /tmp/keycloak/import

# port offset 6 is set because we want the server to be accessible both from host and from the sso container in local network claster.
# host name is made available by specifying it in the hosts file in host machine.
# port offset will cause changing port to 8086 which will be the same as exposed port to host.

CMD ["-b", "0.0.0.0", "-Dkeycloak.migration.action=import", "-Dkeycloak.migration.provider=dir", "-Dkeycloak.migration.dir=/tmp/keycloak/import", "-Dkeycloak.migration.strategy=OVERWRITE_EXISTING", "-Djboss.socket.binding.port-offset=6"]

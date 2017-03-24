FROM java:8-jre-alpine
RUN apk add --update pwgen bash wget ca-certificates && rm -rf /var/cache/apk/*

MAINTAINER Stian Soiland-Reyes <stain@apache.org>

##
# Add a user for the service. Make sure it is in group root
RUN adduser -D -G root -g "FUSEKI" 2001
# This is important. Must allow any user to make files in home directory

#Force home for any user to be. Home is not set for openshift user.
ENV HOME=/jena-fuseki

# Update below according to https://jena.apache.org/download/
ENV FUSEKI_SHA1 945ba476c5ffe946e3679352fc5b1edd3eb09334
ENV FUSEKI_VERSION 2.5.0
ENV FUSEKI_MIRROR http://www.eu.apache.org/dist/
ENV FUSEKI_ARCHIVE http://archive.apache.org/dist/
#

# Installation folder
ENV FUSEKI_HOME /jena-fuseki

WORKDIR /tmp
# sha1 checksum
RUN echo "$FUSEKI_SHA1  fuseki.tar.gz" > fuseki.tar.gz.sha1
# Download/check/unpack/move in one go (to reduce image size)
RUN     wget -O fuseki.tar.gz $FUSEKI_MIRROR/jena/binaries/apache-jena-fuseki-$FUSEKI_VERSION.tar.gz || \
        wget -O fuseki.tar.gz $FUSEKI_ARCHIVE/jena/binaries/apache-jena-fuseki-$FUSEKI_VERSION.tar.gz && \
        sha1sum -c fuseki.tar.gz.sha1 && \
        tar zxf fuseki.tar.gz && \
        mv apache-jena-fuseki* $FUSEKI_HOME && \
        rm fuseki.tar.gz* && \
        cd $FUSEKI_HOME && rm -rf fuseki.war


# As "localhost" is often inaccessible within Docker container,
# we'll enable basic-auth with a random admin password
# (which we'll generate on start-up)
COPY shiro.ini /jena-fuseki/shiro.ini
COPY docker-entrypoint.sh /
RUN chmod 755 /docker-entrypoint.sh

COPY load.sh /jena-fuseki/
COPY tdbloader /jena-fuseki/
RUN chmod 755 /jena-fuseki/load.sh /jena-fuseki/tdbloader
#VOLUME /staging

RUN chown -R 2001 /jena-fuseki/

# Config and data
RUN mkdir /fuseki && chown 2001 /fuseki
RUN mkdir /fuseki/configuration && chown 2001 /fuseki/configuration
RUN mkdir /fuseki/databases && chown -R 2001 /fuseki/databases && chmod 777 /fuseki/databases
RUN mkdir /fuseki/backups && chown 2001 /fuseki/backups
RUN mkdir /fuseki/templates && chown 2001 /fuseki/templates


VOLUME /fuseki
RUN ls -l /

ADD dcat-config.ttl /fuseki/configuration/
ADD admin-config.ttl /fuseki/configuration/

RUN chown -R 2001 /fuseki/configuration/

RUN ls -l /fuseki/databases

ENV FUSEKI_BASE /fuseki
# Where we start our server from

# Force other user than root
USER 2001

WORKDIR /jena-fuseki
EXPOSE 3030
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["/jena-fuseki/fuseki-server"]

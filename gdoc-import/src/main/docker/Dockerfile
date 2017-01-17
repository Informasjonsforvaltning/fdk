FROM ubuntu:latest

ENV TZ=Europe/Oslo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Install curl, soffice and jre8
RUN apt-get update && apt-get -y install curl && \
    apt-get -y install libreoffice-calc && apt-get -y install openjdk-8-jre

# Add a user for the service. Make sure it is in group root
RUN adduser --disabled-password --gid 0 --gecos "GDOC" gdoc
# This is important. Must allow any user to make files in home directory
RUN mkdir -m 0777 /home/1000 && chown gdoc:root /home/1000

#Force home for any user to be. Home is not set for openshift user.
ENV HOME=/home/1000

# Set the working directory to home directory
WORKDIR /home/1000

# Specify a user to execute all commands below
USER gdoc

RUN mkdir dcat && mkdir dcat/temp && mkdir dcat/in && mkdir dcat/publish && mkdir dcat/validation && mkdir dcat/mapper && mkdir dcat/lib

RUN ls -al

# copy the various files
COPY validation dcat/validation
COPY mapper dcat/mapper
COPY semex.jar dcat/lib/
COPY lib2/*.jar dcat/lib/
COPY lib/*.jar dcat/lib/

RUN ls -al dcat/lib

COPY dcat.sh dcat/dcat.sh

USER root
RUN chown -R gdoc:root dcat
RUN chmod 775 dcat dcat/in dcat/temp dcat/publish
RUN chmod +x dcat/dcat.sh

RUN ls -al dcat

ADD gdoc-import-?.?.?-SNAPSHOT.jar app.jar
RUN chown gdoc:root app.jar
RUN sh -c 'touch app.jar'

RUN ls -al

# Openshift expects a numeric user
USER 1000

VOLUME /home/1000/dcat/in
VOLUME /home/1000/dcat/temp
VOLUME /home/1000/dcat/publish

ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","app.jar"]

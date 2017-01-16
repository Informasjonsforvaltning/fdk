FROM ubuntu:latest

ENV TZ=Europe/Oslo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt-get update && apt-get -y install curl && apt-get -y install libreoffice && \
    apt-get -y install libreoffice-calc && apt-get -y install openjdk-8-jre

#RUN apt-get update
#RUN apt-get -y install libreoffice
#RUN apt-get -y install openjdk-8-jre c

# Add the user UID:1000, GID:1000, home at /app
#RUN groupadd -r app -g 1000 && useradd -u 1000 -r -g app -m -d /app -s /sbin/nologin -c "App user" app && \
#    chmod 755 /app

RUN useradd -ms /bin/bash 1000

# Set the working directory to app home directory
WORKDIR /home/1000

# Specify the user to execute all commands below
USER 1000

RUN mkdir dcat && mkdir dcat/temp && mkdir dcat/in && mkdir dcat/publish && mkdir dcat/validation && mkdir dcat/mapper && mkdir dcat/lib

RUN ls -al

COPY validation dcat/validation
COPY mapper dcat/mapper
COPY semex.jar dcat/lib/
COPY lib2/*.jar dcat/lib/
COPY lib/*.jar dcat/lib/

RUN ls -al dcat/lib

COPY dcat.sh dcat/dcat.sh

USER root
RUN chown 1000:1000 dcat/dcat.sh && chmod +x dcat/dcat.sh

RUN ls -al dcat

ADD gdoc-import-?.?.?-SNAPSHOT.jar app.jar
RUN chown 1000:1000 app.jar
RUN sh -c 'touch app.jar'

RUN ls -al

USER 1000

VOLUME /home/1000/dcat/in
VOLUME /home/1000/dcat/temp
VOLUME /home/1000/dcat/publish

ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","app.jar"]


#WORKDIR /usr/local/dcat
#CMD ./dcat.sh
#

FROM ubuntu:latest

ENV TZ=Europe/Oslo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt-get update
RUN apt-get -y install libreoffice
RUN apt-get -y install openjdk-8-jre curl


# Add the user UID:1000, GID:1000, home at /app
RUN groupadd -r app -g 1000 && useradd -u 1000 -r -g app -m -d /app -s /sbin/nologin -c "App user" app && \
    chmod 755 /app

# Set the working directory to app home directory
WORKDIR /app

# Specify the user to execute all commands below
USER app

RUN mkdir /app/dcat
RUN mkdir /app/dcat/temp
RUN mkdir /app/dcat/in
RUN mkdir /app/dcat/publish
RUN mkdir /app/dcat/validation
RUN mkdir /app/dcat/mapper
RUN mkdir /app/dcat/lib

COPY validation /app/dcat/validation
COPY mapper /app/dcat/mapper
COPY semex.jar /app/dcat/lib/
COPY lib2/*.jar /app/dcat/lib/
COPY lib/*.jar /app/dcat/lib/

COPY dcat.sh /app/dcat/dcat.sh

WORKDIR /app/dcat
RUN ls -al

USER root
RUN chown app:app /app/dcat/dcat.sh
RUN chmod +x /app/dcat/dcat.sh
USER app
RUN ls -al

VOLUME /app/dcat

#ADD gdoc-import*.jar app.jar
#RUN sh -c 'touch /app.jar'
#ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]

#WORKDIR /usr/local/dcat
#CMD ./dcat.sh
#

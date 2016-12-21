FROM ubuntu:latest

ENV TZ=Europe/Oslo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt-get update
RUN apt-get -y install libreoffice
RUN apt-get -y install openjdk-8-jre curl

RUN mkdir /usr/local/dcat
RUN mkdir /usr/local/dcat/temp
RUN mkdir /usr/local/dcat/in
RUN mkdir /usr/local/dcat/publish
RUN mkdir /usr/local/dcat/validation
RUN mkdir /usr/local/dcat/mapper
RUN mkdir /usr/local/dcat/lib

COPY validation /usr/local/dcat/validation
COPY mapper /usr/local/dcat/mapper
COPY semex.jar /usr/local/dcat/lib/
COPY lib2/*.jar /usr/local/dcat/lib/
COPY lib/*.jar /usr/local/dcat/lib/

ADD dcat.sh /usr/local/dcat/dcat.sh
RUN chmod +x /usr/local/dcat/dcat.sh

VOLUME /usr/local/dcat

WORKDIR /usr/local/dcat
CMD ./dcat.sh

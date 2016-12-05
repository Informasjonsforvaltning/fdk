FROM ubuntu:latest

VOLUME /temp/dcat

ENV TZ=Europe/Oslo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

#RUN apt-get remove --purge libreoffice*
#RUN apt-get clean
#RUN apt-get autoremove

#RUN add-apt-repository ppa:upubuntu-com/openoffice
RUN apt-get update

#RUN apt-get install apache-openoffice
RUN apt-get -y install libreoffice
RUN apt-get -y install unzip openjdk-8-jre curl
#RUN apt-get -y install openjdk-8-jre
#RUN apt-get -y install curl

RUN mkdir /usr/local/dcat
RUN mkdir /usr/local/dcat/temp

RUN mkdir /usr/local/dcat/validation
COPY validation /usr/local/dcat/validation

RUN mkdir /usr/local/dcat/mapper
COPY mapper /usr/local/dcat/mapper

RUN mkdir /usr/local/dcat/lib
COPY semex.jar /usr/local/dcat/lib

COPY lib2 /usr/local/dcat/lib

RUN mkdir /usr/local/dcat/jenaTemp
ADD apache-jena-3.1.1.zip /usr/local/dcat/jenaTemp

RUN mkdir /usr/local/dcat/in
RUN mkdir /usr/local/dcat/publish

WORKDIR /usr/local/dcat/jenaTemp/
RUN unzip -o /usr/local/dcat/jenaTemp/apache-jena-3.1.1.zip
RUN mv /usr/local/dcat/jenaTemp/apache-jena-3.1.1/lib/* /usr/local/dcat/lib/

ADD dcat.sh /usr/local/dcat/dcat.sh

RUN chmod +x /usr/local/dcat/dcat.sh

WORKDIR /usr/local/dcat
CMD ./dcat.sh

#FROM tomcat:8
FROM tomcat:8-jre8
#ENV TERM xterm


ENV TZ=Europe/Oslo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

#RUN apt-get install haveged -y

ADD harvester-war-0.2.0-SNAPSHOT.war /usr/local/tomcat/webapps/harvester.war

ADD tomcat-users.xml /usr/local/tomcat/conf/
ADD server.xml /usr/local/tomcat/conf/

WORKDIR /usr/local/tomcat/

#FROM frolvlad/alpine-oraclejdk8:slim

#ENV TZ=Europe/Oslo
#RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

#VOLUME /tmp
#ADD harvester-0.1.0.war app.war
#RUN sh -c 'touch /app.war'
#ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.war"]
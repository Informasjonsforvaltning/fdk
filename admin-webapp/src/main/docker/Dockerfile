FROM tomcat:8-jre8
#ENV TERM xterm

ENV TZ=Europe/Oslo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

ADD admin-webapp-0.2.0-SNAPSHOT.war /usr/local/tomcat/webapps/admin-webapp.war

ADD tomcat-users.xml /usr/local/tomcat/conf/
ADD server.xml /usr/local/tomcat/conf/

WORKDIR /usr/local/tomcat/

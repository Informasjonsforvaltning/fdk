FROM tomcat:8-jre8
ENV TERM xterm

ADD build/harvester-app-0.1.0.war /usr/local/tomcat/webapps/harvester-app.war

ADD tomcat-users.xml /usr/local/tomcat/conf/
ADD server.xml /usr/local/tomcat/conf/

WORKDIR /usr/local/tomcat/

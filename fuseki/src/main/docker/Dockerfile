FROM tomcat:8-jre8

RUN mkdir /usr/local/tomcat/fusekiDownloadTemp
RUN mkdir /etc/fuseki/
RUN mkdir /etc/fuseki/databases/
RUN mkdir /etc/fuseki/databases/dcat/
RUN mkdir /etc/fuseki/databases/admin/

ADD apache-jena-fuseki-2.3.1.zip /usr/local/tomcat/fusekiDownloadTemp

ADD tomcat-users.xml /usr/local/tomcat/conf/
ADD server.xml /usr/local/tomcat/conf/

WORKDIR /usr/local/tomcat/fusekiDownloadTemp/

RUN unzip -o /usr/local/tomcat/fusekiDownloadTemp/apache-jena-fuseki-2.3.1.zip

RUN mv /usr/local/tomcat/fusekiDownloadTemp/apache-jena-fuseki-2.3.1/fuseki.war /usr/local/tomcat/webapps/fuseki.war

ADD dcat-config.ttl /etc/fuseki/configuration/
ADD admin-config.ttl /etc/fuseki/configuration/
ADD shiro.ini /etc/fuseki/

WORKDIR /usr/local/tomcat/

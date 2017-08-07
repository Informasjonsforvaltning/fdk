FROM frolvlad/alpine-oraclejdk8:slim

ENV TZ=Europe/Oslo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN mkdir /git/
RUN mkdir /git/fdk-properties/
RUN chmod 755 -R /git/fdk-properties/

VOLUME /tmp
ADD registrering-?.?.?-SNAPSHOT-exec.jar app.jar
RUN sh -c 'touch /app.jar'
CMD java -jar  $JAVA_OPTS  -Dspring.profiles.active=docker -Dspring.config.location=/git/fdk-properties/ app.jar


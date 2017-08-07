FROM frolvlad/alpine-oraclejdk8:slim

ENV TZ=Europe/Oslo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

ADD registration-authorization-?.?.?-SNAPSHOT-exec.jar app.jar
RUN sh -c 'touch /app.jar'

CMD java -jar  $JAVA_OPTS  -Dspring.profiles.active=docker  app.jar


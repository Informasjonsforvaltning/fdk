FROM  maven:3.5-jdk-8

ENV TZ=Europe/Oslo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

#RUN apt-get update && apt-get -y install curl && \
#    apt-get -y install openjdk-8-jre

RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get install -y nodejs
RUN apt-get install -y build-essential

#RUN apt-get -y install chromium-browser

#RUN apt-get -y install maven


ENV DOCKER_HOST unix:///var/run/docker.sock
ENV CHROME_BIN chromium-browser
ENV DISPLAY :99.0


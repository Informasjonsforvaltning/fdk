FROM node:8-alpine

ENV TZ=Europe/Oslo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

#NB curl for testing, kan slettes til slutt?
#install necessary software: cron, curl, node, npm and elasticdump
#RUN apt-get update && apt-get install -y cron curl nodejs npm
RUN apk add --no-cache curl
RUN npm init -y
RUN npm install -g elasticdump

#copy elasticsearch backup script
RUN mkdir -p /scripts && chmod 777 /scripts
ADD escopy.sh /scripts/escopy.sh
RUN chmod +x /scripts/escopy.sh

#set up crontab and log file
ADD crontab /scripts/es.crontab
RUN crontab /scripts/es.crontab
RUN touch /var/log/backup.log

#NB tail for testing, kan fjernes til slutt
CMD tail -f /var/log/backup.log
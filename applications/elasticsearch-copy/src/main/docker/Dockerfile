FROM node:8-alpine

ENV TZ=Europe/Oslo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

#NB curl for testing, kan slettes til slutt?
#install necessary software: cron, curl, node, npm and elasticdump
#RUN apt-get update && apt-get install -y cron curl nodejs npm
RUN apk add --no-cache curl
RUN npm init -y
RUN npm config set unsafe-perm true
RUN npm install -g elasticdump

#install Supercronic - cron job runner specially designed for containers
ENV SUPERCRONIC_URL=https://github.com/aptible/supercronic/releases/download/v0.1.5/supercronic-linux-amd64 \
    SUPERCRONIC=supercronic-linux-amd64 \
    SUPERCRONIC_SHA1SUM=9aeb41e00cc7b71d30d33c57a2333f2c2581a201

RUN curl -fsSLO "$SUPERCRONIC_URL" \
 && echo "${SUPERCRONIC_SHA1SUM}  ${SUPERCRONIC}" | sha1sum -c - \
 && chmod +x "$SUPERCRONIC" \
 && mv "$SUPERCRONIC" "/usr/local/bin/${SUPERCRONIC}" \
 && ln -s "/usr/local/bin/${SUPERCRONIC}" /usr/local/bin/supercronic

#copy elasticsearch backup script
RUN mkdir -p /scripts && chmod 777 /scripts
ADD escopy.sh /scripts/escopy.sh
RUN chmod +x /scripts/escopy.sh

#set up crontab and log file
ADD crontab /scripts/crontab
RUN touch /var/log/backup.log

CMD supercronic /scripts/crontab
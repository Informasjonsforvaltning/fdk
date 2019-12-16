FROM node:12-alpine

#the only reason why we need git here, is that we have designsystem in another github repo
RUN apk add --no-cache git gettext
# to run localhost docker

WORKDIR /usr/src/app

# most volatile files latest, in order to reuse layers.
COPY package.json /usr/src/app/package.json
COPY package-lock.json /usr/src/app/package-lock.json

# Install app dependencies
RUN npm install --loglevel=warn
RUN npm audit

COPY server /usr/src/app/server
COPY start.js /usr/src/app/
COPY .babelrc /usr/src/app/
COPY webpack /usr/src/app/webpack

COPY test /usr/src/app/test
COPY src /usr/src/app/src

RUN npm test

RUN npm run build

RUN rm -rf src
RUN rm -rf test
RUN rm -rf coverage
RUN rm -rf node_modules
RUN rm package.json
RUN rm package-lock.json

RUN npm init -y
RUN npm config set unsafe-perm true
RUN npm install express compression lodash --loglevel error
RUN npm install pm2 -g --loglevel error

COPY entrypoint.sh /usr/src/app/
RUN chmod +x entrypoint.sh
EXPOSE 4300

ENTRYPOINT ./entrypoint.sh

FROM node:12-alpine

#the only reason why we need git here, is that we have designsystem in another github repo
RUN apk add --no-cache git
# to run localhost docker

RUN npm init -y
RUN npm config set unsafe-perm true
RUN npm install ejs express method-override body-parser compression --loglevel error
RUN npm install pm2 -g --loglevel error

# Create app directory
RUN mkdir -p /usr/src/app && chmod 777 /usr/src/app
RUN mkdir /.pm2 && chmod 777 /.pm2
WORKDIR /usr/src/app

COPY package.json /usr/src/app/package.json
COPY package-lock.json /usr/src/app/package-lock.json

# Install app dependencies
RUN npm install --loglevel=warn
RUN npm audit

COPY server /usr/src/app/server
COPY .babelrc /usr/src/app/
COPY webpack.prod.config.js /usr/src/app/

# most volatile directory latest, in order to reuse layers.
COPY src /usr/src/app/src

COPY test /usr/src/app/test
RUN npm test
RUN rm -rf /usr/src/app/test

RUN npm run build

RUN npm prune --production

EXPOSE 4300

CMD [ "pm2-docker", "./server/start.js" ]

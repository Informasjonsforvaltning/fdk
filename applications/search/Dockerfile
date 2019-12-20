FROM node:12-alpine

#the only reason why we need git here, is that we have designsystem in another github repo
RUN apk add --no-cache git gettext
# to run localhost docker
RUN npm init -y
RUN npm config set unsafe-perm true
RUN npm install express --loglevel error
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
COPY env.template.json /usr/src/app/
COPY start.js /usr/src/app/
COPY .babelrc /usr/src/app/
COPY webpack.* /usr/src/app/

# most volatile directory latest, in order to reuse layers.
COPY src /usr/src/app/src

COPY test /usr/src/app/test
RUN npm test

RUN npm prune --production
RUN rm -rf /usr/src/app/test

RUN npm run build

EXPOSE 3000

COPY entrypoint.sh /usr/src/app/
RUN chmod +x entrypoint.sh

ENTRYPOINT ./entrypoint.sh
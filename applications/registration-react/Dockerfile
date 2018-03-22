FROM node:8-alpine

# to run localhost docker

RUN npm init -y
RUN npm install ejs express method-override body-parser compression --loglevel error
RUN npm install pm2 -g --loglevel error

# Create app directory
RUN mkdir -p /usr/src/app && chmod 777 /usr/src/app
RUN mkdir /.pm2 && chmod 777 /.pm2
WORKDIR /usr/src/app

COPY package.json /usr/src/app/package.json

# Install app dependencies
RUN npm install --loglevel=warn
COPY . /usr/src/app/

RUN npm run build

#RUN npm test

#ENV NODE_ENV production

EXPOSE 4300

CMD [ "pm2-docker", "start.js" ]

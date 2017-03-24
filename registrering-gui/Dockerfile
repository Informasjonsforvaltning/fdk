FROM node:6.10-alpine

# to run localhost docker
#FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
RUN mkdir -p /usr/src/app/src
COPY dist/* /usr/src/app/src/
#COPY dist /usr/src/app -- denne burde være istedet for den over
COPY .angular-cli.json /usr/src/app
COPY karma.conf.js /usr/src/app
COPY protractor.conf.js /usr/src/app

EXPOSE 4200

CMD [ "npm", "start" ]

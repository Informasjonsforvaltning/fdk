FROM node:6.10-alpine

# to run localhost docker
#FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY . /usr/src/app/

RUN npm install

# Bundle app source
COPY dist/* /usr/src/app/
#COPY dist /usr/src/app -- denne burde være istedet for den over

EXPOSE 8080

CMD [ "npm", "start" ]

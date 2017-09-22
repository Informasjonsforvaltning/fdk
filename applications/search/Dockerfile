FROM node:6.11

# to run localhost docker
#FROM node:boron

RUN npm init -y
RUN npm install ejs express method-override body-parser compression
RUN npm install pm2 -g

#RUN apk update
#RUN apk add python

# Create app directory
RUN mkdir -p /usr/src/app && chmod 777 /usr/src/app
RUN mkdir /.pm2 && chmod 777 /.pm2
WORKDIR /usr/src/app

COPY package.json /usr/src/app/package.json
RUN npm install


# Install app dependencies
COPY . /usr/src/app/

RUN npm build

#COPY dist /usr/src/app -- denne burde være istedet for den over


EXPOSE 3000

CMD [ "pm2-docker", "start.js" ]

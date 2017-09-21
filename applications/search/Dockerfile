FROM node:6.10-alpine

# to run localhost docker
#FROM node:boron

RUN npm init -y
RUN npm install ejs express method-override body-parser compression
RUN npm install pm2 -g

# Create app directory
RUN mkdir -p /usr/src/app && chmod 777 /usr/src/app
RUN mkdir /.pm2 && chmod 777 /.pm2
WORKDIR /usr/src/app

# Install app dependencies
COPY . /usr/src/app/

RUN cd /usr/src/app && npm install


#COPY dist /usr/src/app -- denne burde være istedet for den over


EXPOSE 3000

CMD [ "pm2-docker", "start.js" ]

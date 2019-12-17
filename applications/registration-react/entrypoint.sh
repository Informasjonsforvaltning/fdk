envsubst  < ./config.template.js > ./config.js

#http://pm2.keymetrics.io/docs/usage/docker-pm2-nodejs/
pm2-runtime start.js


#!/bin/sh
envsubst < ./config.template.js > ./config.js;
nginx -g "daemon off;"

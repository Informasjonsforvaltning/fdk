#!/usr/bin/env sh
echo Running webpack.
webpack --config webpack.prod.config.js -p
pm2-docker start.js
#!/usr/bin/env sh
echo Running webpack. Disqus shortname:
echo $DISQUS_SHORTNAME
webpack --config webpack.prod.config.js -p
pm2-docker start.js
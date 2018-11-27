#!/usr/bin/env bash
url=($1)
echo "Testing url" $url
while [[ "$(curl -s -o /dev/null -w ''%{http_code}'' $url)" != "200" ]];
    do sleep 5;
    echo "Retrying url" $url;
done
echo "Success 200 from " $url
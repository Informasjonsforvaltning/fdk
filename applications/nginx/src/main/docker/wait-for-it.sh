#!/bin/bash
# wait-for-it
echo "Wait for it "

sleep 10
echo "slept finished"

exec nginx -g "daemon off;"
echo "exit"
exit


set -e

cmd="$@"

echo "Command " $cmd
response=$(curl --write-out %{http_code} --silent --output /dev/null http://localhost:5820)
  until [ $response -eq 401 ]; do
    printf '.'
    sleep 5
    response=$(curl --write-out %{http_code} --silent --output /dev/null http://localhost:5820)
  done

until curl http://registration-api:8080; do
  >&2 echo "API is unavailable - sleeping"
  sleep 1
done

>&2 echo "Starting command: " + $cmd
echo exec $cmd
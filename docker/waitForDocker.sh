#!/usr/bin/env bash
# Initial sleep to make sure docker has started
sleep 5

while : ; do

    # Get cpu % from docker stats, remove '%' and then sum all the values into one number
    CPU=`docker stats --no-stream --format "{{.CPUPerc}}" | awk '{gsub ( "[%]","" ) ; print $0 }' | awk '{s+=$1} END {print s}'`
    echo "CPU: $CPU%"

    # Do floating point comparison, if $CPU is bigger than 10, WAIT will be 1
    WAIT=`echo $CPU'>'10 | bc -l`
    echo "WAIT (0/1): $WAIT"

    # Break from loop if WAIT is 1, which is when the sum of the cpu usage is bigger than 10%
    [[ "$WAIT" -eq 1 ]] || break

    # Else sleep and loop
    echo "Waiting for docker"
    sleep 1

done

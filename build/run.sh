
machine="docker run -it --rm --name my-maven-project -v C:\Users\nodavsko\git\fdk:/usr/src/mymaven  -v /var/run/docker.sock:/var/run/docker.sock -w /usr/src/mymaven build:latest"


exec $machine mvn install -DskipTests -Dmaven.javadoc.skip=true -B > /dev/null  && docker-compose up -d  && ./waitForDocker.sh  &&  mvn verify -DskipDockerBuild -B -P all-tests org.jacoco:jacoco-maven-plugin:report


#Felles datakatalog

Compile:
mvn clean install -DskipTests

admin-webapp and harvester-app
mvn package spring-boot:repackage -DskipTests

#Docker:
##Start
cd docker
docker-compose up -d

##Stop
docker-compose down


###DCAT API
http://localhost:8080/api-app/

###DCAT Harvester Admin
http://localhost:8080/admin-webapp/admin

test_user password
test_admin password

###Elasticsearch
http://localhost:9200

###Kibana
http://localhost:5601/

###FUSEKI
http://localhost:3030/fuseki/


#Common Problems

ERROR: for elasticsearch  No such image: sha256:09e6a3991c52f2fd3466fdc1bc34eb7a5e0929ed3367cf964c4f7e58a1fc5231
Solution: remove old containers
bash: docker rm -f $(docker ps -aq)

Remove old images
bash: docker rmi -f $(docker images -q)

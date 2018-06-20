#@echo Start test admin service - http://localhost:8079
java -Dfile.encoding=UTF-8 -jar lib/test-0.2.2-SNAPSHOT.jar --spring.profiles.active=test --application.elasticsearchHosts="localhost:9300" --application.elasticsearchCluster=elasticsearch --server.port=8079
























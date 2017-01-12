@echo Start test admin service - http://localhost:8079
START /b "test-admin" java -Dfile.encoding=UTF-8 -jar lib\test-0.2.2-SNAPSHOT.jar --spring.profiles.active=test --application.elasticsearchPort=9300 --application.elasticsearchHost=localhost --application.elasticsearchCluster=elasticsearch --server.port=8079

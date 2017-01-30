
echo Start portal - http://localhost:8070
java -Dfile.encoding=UTF-8 -jar lib/webapp-0.2.2-SNAPSHOT.jar --spring.profiles.active=test --application.queryServiceExternal=http://localhost:8083 --application.queryService=http://localhost:8083 --server.port=8070

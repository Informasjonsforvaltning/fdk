@echo off

echo Felles datakatalog test

echo Start elasticsearch - http://localhost:9200
START /b "test-elastic" elasticsearch-2.4.1\bin\elasticsearch.bat

echo Start query service - http://localhost:8071/search
START /b "test-query" java -Dfile.encoding=UTF-8 -jar lib\query-0.2.4-SNAPSHOT.jar --spring.profiles.active=test --application.elasticsearchHosts="localhost:9300" --server.port=8071

echo Start portal - http://localhost:8070
START /b "test-portal" java -Dfile.encoding=UTF-8 -jar lib\webapp-0.2.4-SNAPSHOT.jar --spring.profiles.active=test --application.queryServiceExternal=http://localhost:8071 --application.queryService=http://localhost:8071 --server.port=8070

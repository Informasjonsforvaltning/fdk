@echo off

echo Felles datakatalog test

echo Start elasticsearch - http://localhost:9200
START /b "test-elastic" elasticsearch-2.4.1\bin\elasticsearch.bat

echo Start query service - http://localhost:8071/search
START /b "test-query" java -Dfile.encoding=UTF-8 -jar lib\query-0.2.0.jar --spring.profiles.active=test --application.elasticsearchHost=localhost --application.elasticsearchPort=9300 --server.port=8071

echo Start portal service - http://localhost:8070
START /b "test-portal" java -Dfile.encoding=UTF-8 -jar lib\webapp-0.2.0.jar --spring.profiles.active=test --application.queryServiceURL=http://localhost:8071/search --server.port=8070

echo Start test admin service - http://localhost:8079
START /b "test-admin" java -Dfile.encoding=UTF-8 -jar lib\test-0.1.0.jar --spring.profiles.active=test --server.port=8079

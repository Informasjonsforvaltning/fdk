@echo Start test admin service - http://localhost:8079
START /b "test-admin" java -Dfile.encoding=UTF-8 -jar lib\test-0.2.0-SNAPSHOT.jar --spring.profiles.active=test --server.port=8079

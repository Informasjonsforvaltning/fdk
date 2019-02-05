docker-compose stop concept-cat
mvn clean install -pl applications/concept-cat/ -am
docker-compose up --build -d concept-cat
docker-compose up -d

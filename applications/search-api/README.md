# Search api for data catalogId repository 

Docker image: [dcatno/search-api](https://hub.docker.com/r/dcatno/search-api/)
Base image: [ubuntu](https://hub.docker.com/_/ubuntu/)
Source: [Dockerfile](https://github.com/...)

Provides a query api for the data catalogId repository.


# License
dcatno/search: [Apache License, version 2.0](http://www.apache.org/licenses/LICENSE-2.0)

# Use

`docker run -p 8081:8080 dcatno/search-api`

# Depends on

  * dcatno/elasticsearch
  * dcatno/fuseki


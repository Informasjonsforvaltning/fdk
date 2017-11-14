# Search api for data catalog repository 

Docker image: [dcatno/search-api](https://hub.docker.com/r/dcatno/search-api/)
Base image: [ubuntu](https://hub.docker.com/_/ubuntu/)
Source: [Dockerfile](https://github.com/...)

Provides a query api for the data catalog repository.


# License
dcatno/search: [Apache License, version 2.0](http://www.apache.org/licenses/LICENSE-2.0)

# Use

`docker run -p 8081:8080 dcatno/search-api`

# Depends on

  * dcatno/elasticsearch
  * dcatno/fuseki
  
# Search API

Example `/datasets?q=enhet&from=2`

Query parameters
- `q=enhet` (query for spesifik words (wildcard * is allowed))
- `theme=GOVE,SOCI` (datasets that have theme GOVE and SOCI)
- `publisher=DIFI` (datasets from a publisher)
- `accessRight=PUBLIC` (datasets that have accessRights: PUBLIC, )
- `from=0` (show page 0)
- `size=50` (number of hits per page, page size)
- `lang=nb` (filter language)
- `sortfield=title` (sort datasets by title, publisher or modified)
- `sortdirection=asc` (sort direction: asc or desc)



# Search api for data catalog repository 

Docker image: [dcatno/search-api](https://hub.docker.com/r/dcatno/search-api/)
Base image: [openjdk:8-jre-alpine]()
Source: [Dockerfile](https://github.com/...)

Provides a query api for the data catalog repository.


## License
dcatno/search: [Apache License, version 2.0](http://www.apache.org/licenses/LICENSE-2.0)

## Use

`docker run -p 8081:8080 dcatno/search-api`

## Depends on

  * dcatno/elasticsearch
  * dcatno/fuseki
  
## Search for Datasets

Example `/datasets?q=enhet&from=2`. Returns datasets that match *enhet* in title, objective, description, keywords, themes, publisher name and accessrights.  

Query parameters
- `q=enhet` (query for spesifik words (wildcard * is allowed))
- `theme=GOVE,SOCI` (datasets that have theme GOVE and SOCI)
- `publisher=DIFI` (datasets from a publisher)
- `accessRight=PUBLIC` (datasets that have accessRights: PUBLIC, )
- `lastChanged=3` (the datasets that were changed during the last three days)
- `firstHarvestesd=20` (the datasets that were harvested for the first time during the last twenty days)
- `orgPath=/STAT` (all datasets that have publishers that are governmental, other options are /PRIVAT, /FYLKE, /KOMMUNE and /ANNET)
- `from=0` (show page 0)
- `size=50` (number of hits per page, page size)
- `lang=nb` (filter language)
- `sortfield=title` (sort datasets by title, publisher or modified)
- `sortdirection=asc` (sort direction: asc or desc)

## search for title and returnfields
/datasets?title=Postnummer i Norge  (witch returns datasets with title)

/datasets?title=Postnummer i Norge&returnfields=id,uri,publisher,harvest (returns dataset with title and returnFields)


# Search application for DCAT-AP-NO 1.1

Docker image: [dcatno/search](https://hub.docker.com/r/dcatno/search/)
Base image: [node:6.11]()
Source: [Dockerfile](https://github.com/Altinn/fdk/blob/master/applications/search/Dockerfile)

Provides query and filtering capabilities for searching a collection of DCAT catalogs and concepts.
The search application access a search-api and a database cluster (elasticsearch/fuseki) and presents search results to the user in a web ui.


# License
dcatno/search: [Apache License, version 2.0](http://www.apache.org/licenses/LICENSE-2.0)

# Use

`docker run -p 8080:8080 dcatno/search`

To run locally:

1. Run ```npm run dev``` or run ```npm run server``` to start server.

2. Open browser ```http://localhost:3000```

3. Run ```npm run build``` to build webpack bundle.

4. Run ```npm run test``` to run tests.

# Depends on

  * search-api
  * reference-data
  * fuseki
  
# Search
  
Frontend built on React and the SearchKit module. Tests are written with Mocha and Enzyme. ESLint with AirBnB used for linting.

The SearchKit module is a suite of UI components built in React, [Searchkit](http://docs.searchkit.co/stable/)

Most of the SearchKit UI components are extended in this application with custom UI components.


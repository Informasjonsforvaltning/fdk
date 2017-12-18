# Registration application

Docker image: [dcatno/registration](https://hub.docker.com/r/dcatno/registration/)
Base image: [frolvlad/alpine-oraclejdk8:slim](https://hub.docker.com/r/frolvlad/alpine-oraclejdk8/)
Source: [Dockerfile](https://github.com/Altinn/fdk/blob/develop/applications/registration/Dockerfile)

The registration application provides functionality for end users to create, update, store
and publish Data Catalog descriptions.

# Run
```
npm run-script ng serve
```

#  Overview
The registration application allows authorized users to create, update, store and publish Data Catalog descriptions.

# Technologies/frameworks
* Node v6.11.3
* Angular v4.4.4

# Architecture
The application uses two main components; Catalog and Dataset.
* Catalog 
    * catalog.component.ts
        - Allows user to edit description for his catalog.
        - Gives user an overview of the datasets and their status in the catalog.
        - Allows user to import dataset descriptions from external resources or create new dataset descriptions.
    * catalog.service.ts
        - Handles communication with registration-api.
* Dataset
    * dataset.component.ts
        - With child components allows user to edit all dataset description data.
        - Main class for handling data in and out between application and registration-api.        
    * dataset.service.ts
        - Handles communication with registration-api. 
    * validate.ts
        - Handles validation to force proper data form before sending to registration-api.

# Dependencies
* registration-api
* reference-data
* registration-auth
* elasticsearch
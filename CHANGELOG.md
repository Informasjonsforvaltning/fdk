# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

# [1.2.0](https://github.com/Informasjonsforvaltning/fdk/compare/v1.1.0...v1.2.0) (2019-03-18)


### Bug Fixes

* **e2e:** Fix test script names in README.md ([ff5cf5c](https://github.com/Informasjonsforvaltning/fdk/commit/ff5cf5c))
* **informationmodel-cat:** Now combine subforms in a JSON Array ([b64e487](https://github.com/Informasjonsforvaltning/fdk/commit/b64e487))
* **informationmodel-cat:** Now correctly looks up the publisher ([45ae360](https://github.com/Informasjonsforvaltning/fdk/commit/45ae360))
* **registration-react:** [#335](https://github.com/Informasjonsforvaltning/fdk/issues/335) change label when open and show all of abstract as default ([d08bc83](https://github.com/Informasjonsforvaltning/fdk/commit/d08bc83))
* **registration-react:** fix delete distribution-api ([f98c603](https://github.com/Informasjonsforvaltning/fdk/commit/f98c603))
* **search:** [#1518](https://github.com/Informasjonsforvaltning/fdk/issues/1518) report page - filter by organization ([826fa86](https://github.com/Informasjonsforvaltning/fdk/commit/826fa86))
* **search:** report-page - fix distribution graphs calculation ([4eb5558](https://github.com/Informasjonsforvaltning/fdk/commit/4eb5558))
* Fix conflicting port for harvester-api in docker-compose.override.yml ([2fe1308](https://github.com/Informasjonsforvaltning/fdk/commit/2fe1308))
* **search:** Fix search hits stats line ([dc2e1bb](https://github.com/Informasjonsforvaltning/fdk/commit/dc2e1bb))
* **search:** Tab labels in plural ([437115c](https://github.com/Informasjonsforvaltning/fdk/commit/437115c))


### Features

* **api-cat:** Add aggregation "firstHarvested" ([4e49844](https://github.com/Informasjonsforvaltning/fdk/commit/4e49844))
* **concept-cat:** Add aggregation "firstHarvested" ([5ad49bc](https://github.com/Informasjonsforvaltning/fdk/commit/5ad49bc))
* **registration-react:** [#1411](https://github.com/Informasjonsforvaltning/fdk/issues/1411) add API distribution form ([6fca0c3](https://github.com/Informasjonsforvaltning/fdk/commit/6fca0c3))
* **search:** [#1417](https://github.com/Informasjonsforvaltning/fdk/issues/1417) Show total count for apis and concepts in report. ([#1514](https://github.com/Informasjonsforvaltning/fdk/issues/1514)) ([7b9df32](https://github.com/Informasjonsforvaltning/fdk/commit/7b9df32))
* **search:** new design elements to report page ([65eb5bd](https://github.com/Informasjonsforvaltning/fdk/commit/65eb5bd))
* **search-api:** [#1414](https://github.com/Informasjonsforvaltning/fdk/issues/1414) Add new aggregations to dataset search: distributionCountForTypeApi,distributionCountForTypeFeed,distributionCountForTypeFile ([18f8961](https://github.com/Informasjonsforvaltning/fdk/commit/18f8961))
* **search-api:** [#1414](https://github.com/Informasjonsforvaltning/fdk/issues/1414) Add new aggregations to dataset search: nationalComponent ([e38cd6c](https://github.com/Informasjonsforvaltning/fdk/commit/e38cd6c))
* **search-api:** [#1414](https://github.com/Informasjonsforvaltning/fdk/issues/1414) Add new aggregations to dataset search: nonpublicWithDistribution,publicWithoutDistribution,nonpublicWithoutDistribution ([3fd0ade](https://github.com/Informasjonsforvaltning/fdk/commit/3fd0ade))
* **search-api:** [#1414](https://github.com/Informasjonsforvaltning/fdk/issues/1414) Add new aggregations to dataset search: subjects ([ac63a89](https://github.com/Informasjonsforvaltning/fdk/commit/ac63a89))
* **search-api:** [#1414](https://github.com/Informasjonsforvaltning/fdk/issues/1414) DatasetsSearchController - implement filters withDistribution, isPublic, withSubject, isNationalComponent, subject, distributionType ([663719b](https://github.com/Informasjonsforvaltning/fdk/commit/663719b))



# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

# 1.1.0 (2019-02-26)


### Bug Fixes

* **api-cat:** add extra status fields to apis list endpoint ([2ce4636](https://github.com/Informasjonsforvaltning/fdk/commit/2ce4636))
* **reference-data:** update prefLabel apiStatus ([cc85631](https://github.com/Informasjonsforvaltning/fdk/commit/cc85631))
* **registration-api:** Reset api catalog harvest status if harvest url is changed ([5ea8a01](https://github.com/Informasjonsforvaltning/fdk/commit/5ea8a01))
* **registration-react:** add more space inside api access-form ([6194f54](https://github.com/Informasjonsforvaltning/fdk/commit/6194f54))
* **registration-react:** API-964 Api registration checkbox fields are actually nullable booleans. Our forms do not support this type, therefore we must convert it to string. ([c9834e2](https://github.com/Informasjonsforvaltning/fdk/commit/c9834e2))
* **registration-react:** change form order api-registration ([fb1e3bc](https://github.com/Informasjonsforvaltning/fdk/commit/fb1e3bc))
* **registration-react:** filter and show apiStatuses only with value 'code' ([3389108](https://github.com/Informasjonsforvaltning/fdk/commit/3389108))
* **search:** API-967 fix access icons styling ([b5cf076](https://github.com/Informasjonsforvaltning/fdk/commit/b5cf076))
* **search:** API-969 Define translations for api access labels ([702248a](https://github.com/Informasjonsforvaltning/fdk/commit/702248a))
* **search:** API-974 Fix api status order in dropdown ([c9405f4](https://github.com/Informasjonsforvaltning/fdk/commit/c9405f4))
* **search:** fix mispelling autoritativ ([0128ee3](https://github.com/Informasjonsforvaltning/fdk/commit/0128ee3))
* (informationmodel-api): Deep replace component schema references and keep schema structure intact ([c317657](https://github.com/Informasjonsforvaltning/fdk/commit/c317657))
* (informationmodel-cat) Harvest publisher ([590c585](https://github.com/Informasjonsforvaltning/fdk/commit/590c585))
* (informationmodel-cat): Include id field in rest response ([5cd6d41](https://github.com/Informasjonsforvaltning/fdk/commit/5cd6d41))
* (informationomodel-cat) Fix setting title and change history on harvesting ([683d2a9](https://github.com/Informasjonsforvaltning/fdk/commit/683d2a9))
* Add informationmodel-cat to build list ([6224b2f](https://github.com/Informasjonsforvaltning/fdk/commit/6224b2f))
* Disable autogenerated rest resource endpoints ([2fa64c8](https://github.com/Informasjonsforvaltning/fdk/commit/2fa64c8))


### Features

* [#1389](https://github.com/Informasjonsforvaltning/fdk/issues/1389) Release script for generating changelog from conventional commits and creating GitHub release tag ([16d3184](https://github.com/Informasjonsforvaltning/fdk/commit/16d3184))
* **api-cat:** API-787 Add ApiSpecification to ApiDocument ([d4aebcc](https://github.com/Informasjonsforvaltning/fdk/commit/d4aebcc))
* **api-cat:** API-787 Implementation of ApiSpecification model ([8d8644b](https://github.com/Informasjonsforvaltning/fdk/commit/8d8644b))



# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

#  (2019-02-21)


### Bug Fixes

* (informationmodel-api): Deep replace component schema references and keep schema structure intact ([c317657](https://github.com/Informasjonsforvaltning/fdk/commit/c317657))
* (informationmodel-cat) Harvest publisher ([590c585](https://github.com/Informasjonsforvaltning/fdk/commit/590c585))
* (informationmodel-cat): Include id field in rest response ([5cd6d41](https://github.com/Informasjonsforvaltning/fdk/commit/5cd6d41))
* (informationomodel-cat) Fix setting title and change history on harvesting ([683d2a9](https://github.com/Informasjonsforvaltning/fdk/commit/683d2a9))
* Add informationmodel-cat to build list ([6224b2f](https://github.com/Informasjonsforvaltning/fdk/commit/6224b2f))
* Disable autogenerated rest resource endpoints ([2fa64c8](https://github.com/Informasjonsforvaltning/fdk/commit/2fa64c8))
* **registration-api:** Reset api catalog harvest status if harvest url is changed ([5ea8a01](https://github.com/Informasjonsforvaltning/fdk/commit/5ea8a01))


### Features

* **api-cat:** API-787 Add ApiSpecification to ApiDocument ([d4aebcc](https://github.com/Informasjonsforvaltning/fdk/commit/d4aebcc))
* **api-cat:** API-787 Implementation of ApiSpecification model ([8d8644b](https://github.com/Informasjonsforvaltning/fdk/commit/8d8644b))

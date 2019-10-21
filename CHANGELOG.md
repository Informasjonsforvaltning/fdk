# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.10.2](https://github.com/Informasjonsforvaltning/fdk/compare/v1.10.1...v1.10.2) (2019-10-21)


### Bug Fixes

* **search:** changed information model published text ([c3251e9](https://github.com/Informasjonsforvaltning/fdk/commit/c3251e9))
* **user-api:** [#2551](https://github.com/Informasjonsforvaltning/fdk/issues/2551) Increase size of response from altinn reportees query ([c5340b9](https://github.com/Informasjonsforvaltning/fdk/commit/c5340b9))
* **user-api:** [#2551](https://github.com/Informasjonsforvaltning/fdk/issues/2551) Rebuild user-api with altinn-client update ([23f4b4a](https://github.com/Informasjonsforvaltning/fdk/commit/23f4b4a))

### [1.10.1](https://github.com/Informasjonsforvaltning/fdk/compare/v1.10.0...v1.10.1) (2019-10-11)


### Bug Fixes

* **registration-api:** Fix dataset catalog title and description editing by enabling PUT method in cors configuration ([ab064dd](https://github.com/Informasjonsforvaltning/fdk/commit/ab064dd95a14c97efe36d623c217af3cb5010d6d))
* **registration-react:** Save dataset form values for distribution property even if frontend-side validation gives errors ([f97c4ce](https://github.com/Informasjonsforvaltning/fdk/commit/f97c4ce6fa8748c03d2394dd5d59b5fb0f7826f9))
* **registration-react:** Set development server default registration api location to proxy, like it is in other environments ([2a92920](https://github.com/Informasjonsforvaltning/fdk/commit/2a929207c0f0691398350b153b99b69cfbb7b7cd))

## [1.10.0](https://github.com/Informasjonsforvaltning/fdk/compare/v1.9.0...v1.10.0) (2019-10-01)


### Bug Fixes

* **harvesting:** Data norge use https ids for http location tags ([0276d21](https://github.com/Informasjonsforvaltning/fdk/commit/0276d21))
* **refernce-data:** Now actually read and accept open lisences. ([57f8083](https://github.com/Informasjonsforvaltning/fdk/commit/57f8083))
* **registration-react:** [#2382](https://github.com/Informasjonsforvaltning/fdk/issues/2382) increase concept search size ([5410ab7](https://github.com/Informasjonsforvaltning/fdk/commit/5410ab7))
* **registration-react:** [#2449](https://github.com/Informasjonsforvaltning/fdk/issues/2449) add missing languages prop to skjermingsgrunnlag and behandlingsgrunnlag fields in access rights form ([8f94ccd](https://github.com/Informasjonsforvaltning/fdk/commit/8f94ccd))
* **search:** [#2178](https://github.com/Informasjonsforvaltning/fdk/issues/2178) fix access rights styling and remove unused style-class ([99d2613](https://github.com/Informasjonsforvaltning/fdk/commit/99d2613))
* **search:** [#2359](https://github.com/Informasjonsforvaltning/fdk/issues/2359) fix env-variable SEARCH_HOST ([258bde6](https://github.com/Informasjonsforvaltning/fdk/commit/258bde6))
* **search:** [#2359](https://github.com/Informasjonsforvaltning/fdk/issues/2359) related datasets with absolute path to SEARCH_HOST ([b9f42b4](https://github.com/Informasjonsforvaltning/fdk/commit/b9f42b4))
* **search:** [#2370](https://github.com/Informasjonsforvaltning/fdk/issues/2370) change color menu-button mobile view ([5edcd99](https://github.com/Informasjonsforvaltning/fdk/commit/5edcd99))
* **search:** Changed font-color on heading text. ([c0ab67c](https://github.com/Informasjonsforvaltning/fdk/commit/c0ab67c))
* **search:** Fixed text-breaking text in dataset description. ([e9126c3](https://github.com/Informasjonsforvaltning/fdk/commit/e9126c3))


### Features

* **registration-react:** [#1643](https://github.com/Informasjonsforvaltning/fdk/issues/1643) Show datasets that have been connected to the api specification ([7ec79fe](https://github.com/Informasjonsforvaltning/fdk/commit/7ec79fe))
* **registration-react:** [#1762](https://github.com/Informasjonsforvaltning/fdk/issues/1762) Remove publisher filter when looking for datasets to relate to api. ([30e31b5](https://github.com/Informasjonsforvaltning/fdk/commit/30e31b5))
* **registration-react:** [#2261](https://github.com/Informasjonsforvaltning/fdk/issues/2261) add multilingual support for dataset distribution description ([868f21e](https://github.com/Informasjonsforvaltning/fdk/commit/868f21e))
* **registration-react:** [#2261](https://github.com/Informasjonsforvaltning/fdk/issues/2261) add multilingual support for dataset keyword ([3c39fc5](https://github.com/Informasjonsforvaltning/fdk/commit/3c39fc5))
* **registration-react:** [#2261](https://github.com/Informasjonsforvaltning/fdk/issues/2261) add multilingual support for dataset objective ([2309004](https://github.com/Informasjonsforvaltning/fdk/commit/2309004))
* **registration-react:** [#2261](https://github.com/Informasjonsforvaltning/fdk/issues/2261) add multilingual support for dataset provenance and contents ([b16550d](https://github.com/Informasjonsforvaltning/fdk/commit/b16550d))
* **registration-react:** [#2261](https://github.com/Informasjonsforvaltning/fdk/issues/2261) add multilingual support for dataset samples ([781d7f8](https://github.com/Informasjonsforvaltning/fdk/commit/781d7f8))
* **registration-react:** [#2261](https://github.com/Informasjonsforvaltning/fdk/issues/2261) add multilingual support to access rights fields ([564d1ae](https://github.com/Informasjonsforvaltning/fdk/commit/564d1ae))
* **registration-react:** [#2261](https://github.com/Informasjonsforvaltning/fdk/issues/2261) add multilingual support to distribution fields ([23a5ecc](https://github.com/Informasjonsforvaltning/fdk/commit/23a5ecc))
* **registration-react:** [#2261](https://github.com/Informasjonsforvaltning/fdk/issues/2261) add multilingual support to information model fields ([d53db9e](https://github.com/Informasjonsforvaltning/fdk/commit/d53db9e))
* **registration-react:** [#2261](https://github.com/Informasjonsforvaltning/fdk/issues/2261) convert conformsTo field to a multilingual field ([1c0f691](https://github.com/Informasjonsforvaltning/fdk/commit/1c0f691))
* **registration-react:** change breadcrumb texts and update designsystemet v1.4.24 ([da56e8d](https://github.com/Informasjonsforvaltning/fdk/commit/da56e8d))
* **search:** [#2338](https://github.com/Informasjonsforvaltning/fdk/issues/2338) Bruk themeprofile=“transport” when napProfile is in use ([1841b81](https://github.com/Informasjonsforvaltning/fdk/commit/1841b81))
* **search:** [#2339](https://github.com/Informasjonsforvaltning/fdk/issues/2339) hide eu-theme filter if only 'ukjent' ([86fc859](https://github.com/Informasjonsforvaltning/fdk/commit/86fc859))
* **search:** Themify footer email. ([ce6a80c](https://github.com/Informasjonsforvaltning/fdk/commit/ce6a80c))
* Themify footer text ([c37a52f](https://github.com/Informasjonsforvaltning/fdk/commit/c37a52f))
* **search-api:** [#2238](https://github.com/Informasjonsforvaltning/fdk/issues/2238) Add macro-filter themeprofile=transport, that requires either lostTheme of theme to be transport ([e75e4b0](https://github.com/Informasjonsforvaltning/fdk/commit/e75e4b0))
* **user-api:** [#2351](https://github.com/Informasjonsforvaltning/fdk/issues/2351) Add admin role ([3a5abc5](https://github.com/Informasjonsforvaltning/fdk/commit/3a5abc5))

## [1.9.0](https://github.com/Informasjonsforvaltning/fdk/compare/v1.8.0...v1.9.0) (2019-09-20)


### Bug Fixes

* **concept-cat:** [#2128](https://github.com/Informasjonsforvaltning/fdk/issues/2128) harvest URI without removing protocol ([9fb6aa6](https://github.com/Informasjonsforvaltning/fdk/commit/9fb6aa6))
* **e2e:** [#2299](https://github.com/Informasjonsforvaltning/fdk/issues/2299) Break build on audit error ([aa62b58](https://github.com/Informasjonsforvaltning/fdk/commit/aa62b58))
* **reference-data:** Added versioned title of open licence NLOD ([8d6e179](https://github.com/Informasjonsforvaltning/fdk/commit/8d6e179))
* **regisistration-react:** [#2299](https://github.com/Informasjonsforvaltning/fdk/issues/2299) Break build on audit error ([7ec1d3b](https://github.com/Informasjonsforvaltning/fdk/commit/7ec1d3b))
* **registration-react:** [#2265](https://github.com/Informasjonsforvaltning/fdk/issues/2265) show correct languages when creating or returning to previously saved concept ([e398e55](https://github.com/Informasjonsforvaltning/fdk/commit/e398e55))
* **registration-react:** [#2269](https://github.com/Informasjonsforvaltning/fdk/issues/2269) recreate saved data on refresh ([354fc42](https://github.com/Informasjonsforvaltning/fdk/commit/354fc42))
* **registration-react:** [#2281](https://github.com/Informasjonsforvaltning/fdk/issues/2281) replace check mark with icon ([bfbbf24](https://github.com/Informasjonsforvaltning/fdk/commit/bfbbf24))
* **search:** [#1643](https://github.com/Informasjonsforvaltning/fdk/issues/1643) Concatenate list of datasets that refer to the api into the related datasets list in api details page ([368306d](https://github.com/Informasjonsforvaltning/fdk/commit/368306d))
* **search:** [#2128](https://github.com/Informasjonsforvaltning/fdk/issues/2128) user-defined concepts should also be visible ([d6f556a](https://github.com/Informasjonsforvaltning/fdk/commit/d6f556a))
* **search:** [#2268](https://github.com/Informasjonsforvaltning/fdk/issues/2268) Fix dataset lookup query by removing double encoding of url parameter ([8aa5a37](https://github.com/Informasjonsforvaltning/fdk/commit/8aa5a37))
* **search:** [#2276](https://github.com/Informasjonsforvaltning/fdk/issues/2276) allow external links to open in new tab ([dea00f4](https://github.com/Informasjonsforvaltning/fdk/commit/dea00f4))
* **search:** [#2299](https://github.com/Informasjonsforvaltning/fdk/issues/2299) Break build on npm dependencies audit error ([7ba2d32](https://github.com/Informasjonsforvaltning/fdk/commit/7ba2d32))
* **search:** [#2305](https://github.com/Informasjonsforvaltning/fdk/issues/2305) fix LOS theme filtering for NAP context ([bc973f5](https://github.com/Informasjonsforvaltning/fdk/commit/bc973f5))
* **search:** [#2358](https://github.com/Informasjonsforvaltning/fdk/issues/2358) Fix double encoding of dataset by url lookup in dataset details page ([56965d1](https://github.com/Informasjonsforvaltning/fdk/commit/56965d1))
* **search:** Use Switch to avoid double rendering of ambiguous routes concepts/compare and concepts/:id ([381606b](https://github.com/Informasjonsforvaltning/fdk/commit/381606b))
* **search-api:** Allow post query without csrf for search ([cb9a610](https://github.com/Informasjonsforvaltning/fdk/commit/cb9a610))
* **search-api:** Enable cors support for all endpoints ([d20d292](https://github.com/Informasjonsforvaltning/fdk/commit/d20d292))


### Features

* **registration-react:** [#2239](https://github.com/Informasjonsforvaltning/fdk/issues/2239) add input language picker component ([0ce9d2a](https://github.com/Informasjonsforvaltning/fdk/commit/0ce9d2a))
* **registration-react:** [#2240](https://github.com/Informasjonsforvaltning/fdk/issues/2240) implement generic multilingual field ([df3ce3d](https://github.com/Informasjonsforvaltning/fdk/commit/df3ce3d))
* **search:** [#2128](https://github.com/Informasjonsforvaltning/fdk/issues/2128) show sources correctly on concepts search page ([3614061](https://github.com/Informasjonsforvaltning/fdk/commit/3614061))
* **search:** [#2128](https://github.com/Informasjonsforvaltning/fdk/issues/2128) show sources properly ([21ffeb3](https://github.com/Informasjonsforvaltning/fdk/commit/21ffeb3))
* **search:** [#2145](https://github.com/Informasjonsforvaltning/fdk/issues/2145) add nap theming styles ([acbaf65](https://github.com/Informasjonsforvaltning/fdk/commit/acbaf65))
* **search:** [#2254](https://github.com/Informasjonsforvaltning/fdk/issues/2254) hide accessRights filter if nap ([60e21d2](https://github.com/Informasjonsforvaltning/fdk/commit/60e21d2))
* **search-api:** [#1644](https://github.com/Informasjonsforvaltning/fdk/issues/1644) Add search filter distributionAccessServiceEndpointDescriptionUri to allow looking for references to api ([c2445f7](https://github.com/Informasjonsforvaltning/fdk/commit/c2445f7))

# [1.8.0](https://github.com/Informasjonsforvaltning/fdk/compare/v1.7.0...v1.8.0) (2019-09-06)


### Bug Fixes

* **concept-cat:** [#2197](https://github.com/Informasjonsforvaltning/fdk/issues/2197) change bruksområde type to list ([3aeebd9](https://github.com/Informasjonsforvaltning/fdk/commit/3aeebd9))
* **registration-react:** Import bootstrap scss from js instead of scss, so that it would be bundled into vendors.css ([29dde1c](https://github.com/Informasjonsforvaltning/fdk/commit/29dde1c))
* **search:** [#2179](https://github.com/Informasjonsforvaltning/fdk/issues/2179) add concept application to concept details page ([b6c9b82](https://github.com/Informasjonsforvaltning/fdk/commit/b6c9b82))


### Features

* **registration-react:** [#1760](https://github.com/Informasjonsforvaltning/fdk/issues/1760) add 'Ansvarlig', 'tilbyder' and 'eier' at concept live search ([9edc1da](https://github.com/Informasjonsforvaltning/fdk/commit/9edc1da))
* **registration-react:** [#2140](https://github.com/Informasjonsforvaltning/fdk/issues/2140) Show the count of concepts on the concept registration link ([22f033e](https://github.com/Informasjonsforvaltning/fdk/commit/22f033e))
* **registration-react:** Enable development on host ([9746e15](https://github.com/Informasjonsforvaltning/fdk/commit/9746e15))
* **registration-react:** Read REGISTRATION_API_HOST from environment variable ([d5048c0](https://github.com/Informasjonsforvaltning/fdk/commit/d5048c0))
* **search:** [#2139](https://github.com/Informasjonsforvaltning/fdk/issues/2139) Remove feature toggle from concepts link ([f612bb9](https://github.com/Informasjonsforvaltning/fdk/commit/f612bb9))
* **sso:** [#2136](https://github.com/Informasjonsforvaltning/fdk/issues/2136) Allow development host for concept-catalogue-gui ([ca2e3c7](https://github.com/Informasjonsforvaltning/fdk/commit/ca2e3c7))
* **sso:** Allow development host as fdk-registration-public client ([88f3a5a](https://github.com/Informasjonsforvaltning/fdk/commit/88f3a5a))



# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

# [1.7.0](https://github.com/Informasjonsforvaltning/fdk/compare/v1.6.0...v1.7.0) (2019-08-26)


### Bug Fixes

* **registration-api:** Fix null point error on dcat-sources query ([08f5d80](https://github.com/Informasjonsforvaltning/fdk/commit/08f5d80))
* **registration-react:** [#2033](https://github.com/Informasjonsforvaltning/fdk/issues/2033) increase dataset registration page width ([ecd564f](https://github.com/Informasjonsforvaltning/fdk/commit/ecd564f))
* **registration-react:** [#2099](https://github.com/Informasjonsforvaltning/fdk/issues/2099) Implement feature toggle FEATURE_TOGGLE_CONCEPT_REGISTRATION ([7b64f6a](https://github.com/Informasjonsforvaltning/fdk/commit/7b64f6a))
* **registration-react:** Change css class from fdk-color-neutral-darkest2 to fdk-color-neutral-darkest ([cccedaf](https://github.com/Informasjonsforvaltning/fdk/commit/cccedaf))
* **registration-react:** Changed css color from $color-primary04 to $color-primary-lighter ([b3dda57](https://github.com/Informasjonsforvaltning/fdk/commit/b3dda57))
* **registration-react:** Changed from css class fdk-color-primary03 to fdk-color-primary ([4f02300](https://github.com/Informasjonsforvaltning/fdk/commit/4f02300))
* **registration-react:** Flux standard action, says that error action has error in payload, not in error attribute ([00fd26f](https://github.com/Informasjonsforvaltning/fdk/commit/00fd26f))
* **registration-react:** In ProtectedRoutePure, only initialize IdleTimer, when user has logged on. ([ddf8fd5](https://github.com/Informasjonsforvaltning/fdk/commit/ddf8fd5))
* **registration-react:** move tests to container to ensure platform independent build ([2fad538](https://github.com/Informasjonsforvaltning/fdk/commit/2fad538))
* **search:** [#1675](https://github.com/Informasjonsforvaltning/fdk/issues/1675) add dataset origin so that subject would be complete ([b5dd1f6](https://github.com/Informasjonsforvaltning/fdk/commit/b5dd1f6))
* **search:** [#2053](https://github.com/Informasjonsforvaltning/fdk/issues/2053) Fixed center text, changed align-content-center to align-self-center. ([4f59a8a](https://github.com/Informasjonsforvaltning/fdk/commit/4f59a8a))
* **search:** [#2054](https://github.com/Informasjonsforvaltning/fdk/issues/2054) Changed name of icon file. ([d393077](https://github.com/Informasjonsforvaltning/fdk/commit/d393077))
* **search:** [#2145](https://github.com/Informasjonsforvaltning/fdk/issues/2145) Fixed colors for warning and searchhit header. ([b766fc9](https://github.com/Informasjonsforvaltning/fdk/commit/b766fc9))
* **search:** [#2155](https://github.com/Informasjonsforvaltning/fdk/issues/2155) fix env.json.template to generate valid json when empty variables ([6d3be73](https://github.com/Informasjonsforvaltning/fdk/commit/6d3be73))
* **search:** [#2187](https://github.com/Informasjonsforvaltning/fdk/issues/2187) use translations with fallback ([0e3cdb3](https://github.com/Informasjonsforvaltning/fdk/commit/0e3cdb3))
* **search:** fix details page structure ([756cd5f](https://github.com/Informasjonsforvaltning/fdk/commit/756cd5f))
* **search:** move tests to container to ensure platform independent build ([1fbab52](https://github.com/Informasjonsforvaltning/fdk/commit/1fbab52))
* **search,registration-react:** Using design colors ([5f7e65e](https://github.com/Informasjonsforvaltning/fdk/commit/5f7e65e))
* **sso:** [#1958](https://github.com/Informasjonsforvaltning/fdk/issues/1958) Fix broker name for ID-Porten identity provider ([921681e](https://github.com/Informasjonsforvaltning/fdk/commit/921681e))
* **sso:** Use identity provider alias "oidc" temporarily, because this is what is currently configured as allowed return url in idporten oidc provider. ([1f821c3](https://github.com/Informasjonsforvaltning/fdk/commit/1f821c3))


### Features

* **altinn-proxy:** [#1358](https://github.com/Informasjonsforvaltning/fdk/issues/1358) Create client lib for accessing Altinn through proxy ([f95d386](https://github.com/Informasjonsforvaltning/fdk/commit/f95d386))
* **concept-cat:** Usage statistics ([a01745e](https://github.com/Informasjonsforvaltning/fdk/commit/a01745e))
* **enhetsregisteret-proxy:** [#1358](https://github.com/Informasjonsforvaltning/fdk/issues/1358) Create proxy service for accessing enhetsregisteret ([ad8291e](https://github.com/Informasjonsforvaltning/fdk/commit/ad8291e))
* **enhetsregisteret-proxy-mock:** Mock service for enhetsregisteret to fill in corrresponding data for altinn mock ([15cc7bd](https://github.com/Informasjonsforvaltning/fdk/commit/15cc7bd))
* **redux-fsa-thunk:** Make onSuccess and onError properties optional in ReduxFsaThunk library ([c69f06d](https://github.com/Informasjonsforvaltning/fdk/commit/c69f06d))
* **registration-react:** [#1843](https://github.com/Informasjonsforvaltning/fdk/issues/1843) add link to concept client ([0c03d9e](https://github.com/Informasjonsforvaltning/fdk/commit/0c03d9e))
* **search:** [#1674](https://github.com/Informasjonsforvaltning/fdk/issues/1674) show references to datasets on concept details page ([ea92717](https://github.com/Informasjonsforvaltning/fdk/commit/ea92717))
* **search:** [#1888](https://github.com/Informasjonsforvaltning/fdk/issues/1888) update styling on search portal. ([937a64a](https://github.com/Informasjonsforvaltning/fdk/commit/937a64a))
* **search:** [#1979](https://github.com/Informasjonsforvaltning/fdk/issues/1979) add new api-usage-instruction component and tests ([2f0ef5e](https://github.com/Informasjonsforvaltning/fdk/commit/2f0ef5e))
* **search:** add title to sticky-menu component ([506e3bc](https://github.com/Informasjonsforvaltning/fdk/commit/506e3bc))
* **sso:** [#1757](https://github.com/Informasjonsforvaltning/fdk/issues/1757) Implement keycloak user storage service provider for integrating with REST-based user service ([c6714b2](https://github.com/Informasjonsforvaltning/fdk/commit/c6714b2))
* **sso:** [#2140](https://github.com/Informasjonsforvaltning/fdk/issues/2140) add concept-catalogue audience to fdk-registraction-public access token ([9fa0fae](https://github.com/Informasjonsforvaltning/fdk/commit/9fa0fae))
* **sso:** [#2140](https://github.com/Informasjonsforvaltning/fdk/issues/2140) add concept-catalogue client to sso configuration ([e1d9d11](https://github.com/Informasjonsforvaltning/fdk/commit/e1d9d11))
* **sso:** [#2140](https://github.com/Informasjonsforvaltning/fdk/issues/2140) add concept-catalogue-gui client ([a56a7af](https://github.com/Informasjonsforvaltning/fdk/commit/a56a7af))
* **user-api:** [#1689](https://github.com/Informasjonsforvaltning/fdk/issues/1689) User api service ([ce17376](https://github.com/Informasjonsforvaltning/fdk/commit/ce17376))



# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

# [1.6.0](https://github.com/Informasjonsforvaltning/fdk/compare/v1.5.0...v1.6.0) (2019-06-25)


### Bug Fixes

* **e2e:** Fix e2e container build issue by upgrading base container to node:12-slim ([3de3b68](https://github.com/Informasjonsforvaltning/fdk/commit/3de3b68))
* **e2e:** Update tests after change of default set of apis ([67bc8e8](https://github.com/Informasjonsforvaltning/fdk/commit/67bc8e8))
* **reference-data:** Enable all hosts in Cors configuration for reference-data ([85aca0d](https://github.com/Informasjonsforvaltning/fdk/commit/85aca0d))
* **registration-api:** Allow accessing /catalogs without any authorities without crashing in elasticsearch in-expression ([58df600](https://github.com/Informasjonsforvaltning/fdk/commit/58df600))
* **registration-react:** [#1973](https://github.com/Informasjonsforvaltning/fdk/issues/1973) Allow unpublishing in case of validation errors ([5e03450](https://github.com/Informasjonsforvaltning/fdk/commit/5e03450))
* **registration-react:** [#1973](https://github.com/Informasjonsforvaltning/fdk/issues/1973) Fix validation indicators on dataset Los and Theme fields ([6a35906](https://github.com/Informasjonsforvaltning/fdk/commit/6a35906))
* **registration-react:** [#1980](https://github.com/Informasjonsforvaltning/fdk/issues/1980) Fix user information request parameters ([ca0b943](https://github.com/Informasjonsforvaltning/fdk/commit/ca0b943))
* **registration-react:** Allow configuring authorization for reference-data service ([67df037](https://github.com/Informasjonsforvaltning/fdk/commit/67df037))
* **registration-react:** Cache error response of catalogs request, in order to avoid infinite request loop. ([c1b51cb](https://github.com/Informasjonsforvaltning/fdk/commit/c1b51cb))
* **registration-react:** Expose REFERENCE_DATA_HOST variable in env.json in express server ([5b18668](https://github.com/Informasjonsforvaltning/fdk/commit/5b18668))
* **registration-react:** Fix console warning on FilterPillsLos component not setting onChange attribute ([db97ef1](https://github.com/Informasjonsforvaltning/fdk/commit/db97ef1))
* **registration-react:** Fix console warning on invalid proptype for ListRegularItem mainContent proptype ([f51a99c](https://github.com/Informasjonsforvaltning/fdk/commit/f51a99c))
* **registration-react:** Fix invalid defaulting chain of searchHost in config ([e25129d](https://github.com/Informasjonsforvaltning/fdk/commit/e25129d))
* **registration-react:** Fix invalid detection of new items in merging patch action in apis store. ([629226d](https://github.com/Informasjonsforvaltning/fdk/commit/629226d))
* **registration-react:** Fix rendering error on empty datasets query response ([246b14d](https://github.com/Informasjonsforvaltning/fdk/commit/246b14d))
* **registration-react:** Fix scroll position on editing api-registration, by filtering data loading effect only to be run on apiId change ([d74e589](https://github.com/Informasjonsforvaltning/fdk/commit/d74e589))
* **registration-react:** Temporarily disable validation of distribution format field in dataset registration page, because it causes render loop ([d4555a9](https://github.com/Informasjonsforvaltning/fdk/commit/d4555a9))
* **registration-react:** Update feature toggle store implementation to be like in search. Fixes error in console. ([70b14d3](https://github.com/Informasjonsforvaltning/fdk/commit/70b14d3))
* **registration-react:** Use correct action on response of catalog put request ([f93acc6](https://github.com/Informasjonsforvaltning/fdk/commit/f93acc6))
* **registration-react:** Use REDUX_LOG environment variable for enabling redux logger. Fixes verbose log in typical development environment ([463d490](https://github.com/Informasjonsforvaltning/fdk/commit/463d490))
* **search:** [#1656](https://github.com/Informasjonsforvaltning/fdk/issues/1656) Combine datasets api list on dataset detail page from declaration of distributions and api dataset references. ([7ba18dc](https://github.com/Informasjonsforvaltning/fdk/commit/7ba18dc))
* **search:** [#1863](https://github.com/Informasjonsforvaltning/fdk/issues/1863) Changed owner to responsible ([801cce6](https://github.com/Informasjonsforvaltning/fdk/commit/801cce6))
* **search:** Bump react-localization to 1.0.13 to fix bug in phrase template replacement, for example in dataset details sticky menu ([f44abb0](https://github.com/Informasjonsforvaltning/fdk/commit/f44abb0))
* **search:** Fixed position for "clear search" for english language. ([81702af](https://github.com/Informasjonsforvaltning/fdk/commit/81702af))
* **sso:** Set DB_VENDOR to embedded h2, due to just existence of existence "postgres" host caused keycloak to use it. ([57b32f4](https://github.com/Informasjonsforvaltning/fdk/commit/57b32f4))



# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

# [1.5.0](https://github.com/Informasjonsforvaltning/fdk/compare/v1.4.2...v1.5.0) (2019-05-24)


### Bug Fixes

* **registration-react:** Bump react-tag-autocomplete. Fixes console warning of ReactTags not setting onChange handler for input component ([0159584](https://github.com/Informasjonsforvaltning/fdk/commit/0159584))
* **search:** [#1806](https://github.com/Informasjonsforvaltning/fdk/issues/1806) Chnaged colors on search and filter button. ([52157d5](https://github.com/Informasjonsforvaltning/fdk/commit/52157d5))
* **search:** Update helptext in searchbox. ([d352405](https://github.com/Informasjonsforvaltning/fdk/commit/d352405))


### Features

* **search:** [#1851](https://github.com/Informasjonsforvaltning/fdk/issues/1851) Cross in searchbar for clearing text. ([ccd059a](https://github.com/Informasjonsforvaltning/fdk/commit/ccd059a))



# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.4.2](https://github.com/Informasjonsforvaltning/fdk/compare/v1.4.1...v1.4.2) (2019-05-20)


### Bug Fixes

* **search:** [#1743](https://github.com/Informasjonsforvaltning/fdk/issues/1743) Change "Provider"-string field to "Responsible" ([c41c305](https://github.com/Informasjonsforvaltning/fdk/commit/c41c305))
* **search:** [#1759](https://github.com/Informasjonsforvaltning/fdk/issues/1759) remember filter tree open nodes ([4fcb127](https://github.com/Informasjonsforvaltning/fdk/commit/4fcb127))



# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.4.1](https://github.com/Informasjonsforvaltning/fdk/compare/v1.4.0...v1.4.1) (2019-05-14)


### Bug Fixes

* **e2e:** Fixed build script ([6d4add0](https://github.com/Informasjonsforvaltning/fdk/commit/6d4add0))
* **e2e:** Fixed npm run script for Windows. ([a5efe07](https://github.com/Informasjonsforvaltning/fdk/commit/a5efe07))
* **search:** [#1730](https://github.com/Informasjonsforvaltning/fdk/issues/1730) update tab counts when searching ([110add2](https://github.com/Informasjonsforvaltning/fdk/commit/110add2))
* **search:** [#1747](https://github.com/Informasjonsforvaltning/fdk/issues/1747) do not scroll to top when filtering ([cef8e0e](https://github.com/Informasjonsforvaltning/fdk/commit/cef8e0e))
* **search:** Changed from Virksomhet to Eier. ([8da1f9d](https://github.com/Informasjonsforvaltning/fdk/commit/8da1f9d))
* **search-api:** Fix for issue 1754: Filters for LOS themes should be AND, not OR. ([9cd66c3](https://github.com/Informasjonsforvaltning/fdk/commit/9cd66c3))



# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

# [1.4.0](https://github.com/Informasjonsforvaltning/fdk/compare/v1.3.0...v1.4.0) (2019-04-29)


### Bug Fixes

* Fix buildApplication.sh script permissions, to allow execution on mac ([1d89544](https://github.com/Informasjonsforvaltning/fdk/commit/1d89544))
* **concept-cat:** Some organisations do not have a phone registered ([7466589](https://github.com/Informasjonsforvaltning/fdk/commit/7466589))
* **registration-react:** [#1341](https://github.com/Informasjonsforvaltning/fdk/issues/1341) distribution format required field ([d73a26c](https://github.com/Informasjonsforvaltning/fdk/commit/d73a26c))
* **registration-react:** [#1341](https://github.com/Informasjonsforvaltning/fdk/issues/1341) do not allow publishing if distribution missing format ([71e3500](https://github.com/Informasjonsforvaltning/fdk/commit/71e3500))
* **registration-react:** [#1612](https://github.com/Informasjonsforvaltning/fdk/issues/1612) - dataset references form - change from default fetch size 20 to 1000 ([731a5cc](https://github.com/Informasjonsforvaltning/fdk/commit/731a5cc))
* **search:** [#1443](https://github.com/Informasjonsforvaltning/fdk/issues/1443) search filter should not update tab numbers ([00c5b26](https://github.com/Informasjonsforvaltning/fdk/commit/00c5b26))
* **search:** [#1618](https://github.com/Informasjonsforvaltning/fdk/issues/1618) report page - fix styling ([1b837e7](https://github.com/Informasjonsforvaltning/fdk/commit/1b837e7))


### Features

* **registration-react:** [#1604](https://github.com/Informasjonsforvaltning/fdk/issues/1604) add LOS to dataset registration ([9f28d17](https://github.com/Informasjonsforvaltning/fdk/commit/9f28d17))
* **registration-react:** [#1628](https://github.com/Informasjonsforvaltning/fdk/issues/1628) add Los search ([812b273](https://github.com/Informasjonsforvaltning/fdk/commit/812b273))
* **registration-react:** [#1699](https://github.com/Informasjonsforvaltning/fdk/issues/1699) add Los helptext ([c363921](https://github.com/Informasjonsforvaltning/fdk/commit/c363921))
* **search:** [#1686](https://github.com/Informasjonsforvaltning/fdk/issues/1686) Extend clear filters button with filter pills block ([485d208](https://github.com/Informasjonsforvaltning/fdk/commit/485d208))
* **sso:** [#1356](https://github.com/Informasjonsforvaltning/fdk/issues/1356) Set up keycloak container ([12f13d3](https://github.com/Informasjonsforvaltning/fdk/commit/12f13d3))
* **sso:** [#1688](https://github.com/Informasjonsforvaltning/fdk/issues/1688) Configure integration with ID Porten test environment ([9b5356b](https://github.com/Informasjonsforvaltning/fdk/commit/9b5356b))



# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

# [1.3.0](https://github.com/Informasjonsforvaltning/fdk/compare/v1.2.0...v1.3.0) (2019-04-02)


### Bug Fixes

* **api-cat:** Fix swagger documentation for GET /apis paging parameters ([3a85540](https://github.com/Informasjonsforvaltning/fdk/commit/3a85540))
* **reference-data:** Changed text “National Building Block” to “authoritativ source” ([7895465](https://github.com/Informasjonsforvaltning/fdk/commit/7895465))
* **registration-react:** [#1478](https://github.com/Informasjonsforvaltning/fdk/issues/1478) Fix catalogs dataset item count in home page ([db36bfa](https://github.com/Informasjonsforvaltning/fdk/commit/db36bfa))
* **registration-react:** [#1633](https://github.com/Informasjonsforvaltning/fdk/issues/1633) enable distribution type 'API' ([6dc5b87](https://github.com/Informasjonsforvaltning/fdk/commit/6dc5b87))
* **search:** [#1561](https://github.com/Informasjonsforvaltning/fdk/issues/1561) report page fix filter new last week ([d23c0b7](https://github.com/Informasjonsforvaltning/fdk/commit/d23c0b7))
* **search:** [#1639](https://github.com/Informasjonsforvaltning/fdk/issues/1639) do not show distributions heading when no distributions ([66dc0a7](https://github.com/Informasjonsforvaltning/fdk/commit/66dc0a7))


### Features

* **api-cat:** [#1509](https://github.com/Informasjonsforvaltning/fdk/issues/1509) Add new filters to general api search - active, serviceType, orgNos ([519411d](https://github.com/Informasjonsforvaltning/fdk/commit/519411d))
* **api-cat:** add new filters to general api search - isOpenAccess, isOpenLicense and isFree ([84455fc](https://github.com/Informasjonsforvaltning/fdk/commit/84455fc))
* **api-cat,registration-api:** [#1494](https://github.com/Informasjonsforvaltning/fdk/issues/1494) Add servers to ApiSpecification model ([a7f2580](https://github.com/Informasjonsforvaltning/fdk/commit/a7f2580))
* **concept-cat:** [#1416](https://github.com/Informasjonsforvaltning/fdk/issues/1416) Add aggregations to ConceptSearchController - publisher ([de2ac7a](https://github.com/Informasjonsforvaltning/fdk/commit/de2ac7a))
* **concept-cat:** add concept filter uris ([6cc7a34](https://github.com/Informasjonsforvaltning/fdk/commit/6cc7a34))
* **registration-react:** [#1507](https://github.com/Informasjonsforvaltning/fdk/issues/1507) Added API Service Type form control ([623dba9](https://github.com/Informasjonsforvaltning/fdk/commit/623dba9))
* **search:** [#1413](https://github.com/Informasjonsforvaltning/fdk/issues/1413) show api-distributions ([7474172](https://github.com/Informasjonsforvaltning/fdk/commit/7474172))
* **search:** [#1418](https://github.com/Informasjonsforvaltning/fdk/issues/1418) add API report tab ([e8dcd24](https://github.com/Informasjonsforvaltning/fdk/commit/e8dcd24))
* **search:** [#1504](https://github.com/Informasjonsforvaltning/fdk/issues/1504) add concept report tab ([adbeca2](https://github.com/Informasjonsforvaltning/fdk/commit/adbeca2))
* **search:** [#1508](https://github.com/Informasjonsforvaltning/fdk/issues/1508) added service type to api description in portal ([d5c3f6e](https://github.com/Informasjonsforvaltning/fdk/commit/d5c3f6e))
* **search:** [#1580](https://github.com/Informasjonsforvaltning/fdk/issues/1580) concept details - add sample field ([b7236c2](https://github.com/Informasjonsforvaltning/fdk/commit/b7236c2))
* **search-api:** [#1416](https://github.com/Informasjonsforvaltning/fdk/issues/1416) Implementation of counts of concepts used in datasets ([73bef41](https://github.com/Informasjonsforvaltning/fdk/commit/73bef41))
* **search-api:** [#1416](https://github.com/Informasjonsforvaltning/fdk/issues/1416) Support list of concept uris in dataset search ([70dbcf8](https://github.com/Informasjonsforvaltning/fdk/commit/70dbcf8))
* **search-api:** [#1416](https://github.com/Informasjonsforvaltning/fdk/issues/1416) Support POST method in datasets/search for search parameters longer than uri length limit ([70abf4d](https://github.com/Informasjonsforvaltning/fdk/commit/70abf4d))
* **search-api:** [#1506](https://github.com/Informasjonsforvaltning/fdk/issues/1506) Allow registering api service type ([bc3bea9](https://github.com/Informasjonsforvaltning/fdk/commit/bc3bea9))
* **search-api:** [#1506](https://github.com/Informasjonsforvaltning/fdk/issues/1506) Reference data for api service type ([cfc3410](https://github.com/Informasjonsforvaltning/fdk/commit/cfc3410))



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

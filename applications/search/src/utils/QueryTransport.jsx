
import {AxiosESTransport} from "searchkit";
const defaults = require("lodash/defaults");
import * as axios from "axios";
const qs = require('qs');

export class QueryTransport extends AxiosESTransport {
  constructor(host, options){
    super()
    this.options = defaults(options, {
      headers:{},
      //searchUrlPath: window.fdkSettings.queryUrl + "/search"
        // TODO MAKE THIS GENERIC
        searchUrlPath: "/search"
    })
    if(this.options.basicAuth){
      this.options.headers["Authorization"] = (
        "Basic " + btoa(this.options.basicAuth))
    }
    this.axios = axios.create({
      baseURL:this.host,
      timeout:AxiosESTransport.timeout,
      headers:this.options.headers
    })
    this.filters = [
      {
        key: 'publisher.name.raw',
        paramName: 'publisher',
        name: 'publisherCount',
        rawName: 'publisher.name.raw3'
      },
      {
        key: 'theme.code.raw',
        paramName: 'theme',
        rawName: 'theme.code.raw4',
        name: 'theme_count'
      },
      {
        key: 'accessRights.authorityCode.raw',
        paramName: 'accessright',
        rawName: 'accessRights.authorityCode.raw5',
        name: 'accessRightCount'
      },
    ];
  }

  search(query){
    this.filters.forEach((filter)=> {
      // http://localhost:8083/search?q=test&from=0&size=10&lang=nb&publisher=AKERSHUS%20FYLKESKOMMUNE
      filter.query = '';
      let multiple = false;
      if(query.post_filter) { // there is an aggregation post_filter
        if(query.post_filter.bool) { // array of post_filters
          query.post_filter.bool.must.forEach((post_filter) => {
            if(post_filter.term[filter.key]) {
              if(filter.query.length === 0) {
                filter.query += '&' + filter.paramName +'=';
              }
              if (multiple) {
                  filter.query += ',';
              }
              filter.query += encodeURIComponent(post_filter.term[filter.key]);
              multiple = true;
            }
          })
        } else if(query.post_filter.term) { // single post_filter
          filter.query = (query.post_filter.term[filter.key] ? '&' + filter.paramName +'=' + encodeURIComponent(query.post_filter.term[filter.key]) : '');
        }
      }
      filter.query = filter.query.replace(/,\s*$/, "");
    })

    let sortfield = "_score";
    let sortdirection = "asc";

    let querySortObj = query.sort[0]; // assume that only one sort field is possible
    if (querySortObj) { // there is a sort code
      if (_.has(querySortObj, '_score')) {
        sortfield = "_score";
        sortdirection = "asc";
      } else if (_.has(querySortObj, 'title')) {
        sortfield= "title.nb";
      } else if (_.has(querySortObj, 'modified')) {
        sortfield= "modified";
        sortdirection = "desc";
      } else if (_.has(querySortObj,'publisher.name')) {
        sortfield= "publisher.name";
      } else {
        console.log('other! (should not happen)');
      }
    }

    let filtersUrlFragment = this.filters.map(filter=>filter.query).join(''); // build url fragment from list of filters
    return this.axios.get(
      `${this.options.searchUrlPath}?q=` +
			(query.query ? encodeURIComponent(query.query.simple_query_string.query) : '') +
			'&from=' +
			((!query.from) ? '0' : query.from) +
			'&size=' +
      query.size +
      '&lang=nb' +
      filtersUrlFragment +
      (sortfield !== "_score" ? '&sortfield='+sortfield+'&sortdirection='+ sortdirection : '')
		)
      .then(x => new Promise(resolve => setTimeout(() => resolve(x), 50)))
      .then((response)=>this.getData.call(this, response))
  }


  getData(response) {
    let aggregations = response.data.aggregations;
      this.filters.forEach((filter)=>{
        let rawName = filter.rawName;
        let name = filter.name;
        let rawNameShort = rawName.substr(0, rawName.length-1);
        if (aggregations && aggregations.hasOwnProperty(name)) {
            aggregations[rawName] = {};
            aggregations[rawName].size = '5';
            aggregations[rawName][rawNameShort] = aggregations[name];
            aggregations[rawName][rawNameShort].buckets = aggregations[rawName][rawNameShort].buckets.slice(0,100);
            delete aggregations[name];
        }
      })
    const mock = {
        response: {
          "took" : 10,
          "timed_out" : false,
          "_shards" : {
            "total" : 5,
            "successful" : 5,
            "failed" : 0
          },
          "hits" : {
            "total" : 1,
            "max_score" : 0.85435724,
            "hits" : [ {
              "_index" : "dcat",
              "_type" : "dataset",
              "_id" : "http://data.brreg.no/datakatalog/dataset/974761076/80",
              "_score" : 0.85435724,
              "_source" : {
                "id": "3645d5a8-6689-4fc1-8684-d3d6c2d47386",
                "uri": "http://brreg.no/catalogs/987654321/datasets/3645d5a8-6689-4fc1-8684-d3d6c2d47386",
                "catalog": "987654321",
                "title": {
                  "nb": "AAMarkagrensen Oslo Kommune og nærliggende kommuner"
                },
                "description": {
                  "nb": "Datasettet avgrenser område for virkeområdet til lov 6. juni 2009 nr. 35 om naturområder i Oslo og nærliggende kommuner (markaloven) som trådte i kraft 1. september 2009. Markalovens virkeområde er fastsatt i forskrift 4. september 2015 nr. 1032 om justering av markagrensen fastlegger markalovens geografiske virkeområde med tilhørende kart."
                },
                "objective": {
                  "nb": "Datasettes formål er nullam quis rius eget urna mollis ornare vel eu leo. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet fermentum. Vestibulum id ligula porta felis euismod semper."
                },
                "contactPoint": [
                  {
                    "id": "3c50088c-489f-4168-95e6-e6f3cd0c67c5",
                    "uri": "http://brreg.no/catalogs/987654321/contacts/null",
                    "email": "digitalisering@kartverket.no",
                    "organizationUnit": "Avdeling for digitalisering",
                    "hasURL": "http://testetaten.no/url",
                    "hasTelephone": "22306022"
                  }
                ],
                "keyword": [
                  {
                    "nb": "Bestemmelse"
                  },
                  {
                    "nb": "jord"
                  },
                  {
                    "nb": "regulering"
                  },
                  {
                    "nb": "statlig bestemmelse"
                  }
                ],
                "publisher": {
                  "uri": "http://data.brreg.no/enhetsregisteret/enhet/987654321",
                  "id": "987654321",
                  "name": "TESTETATEN"
                },
                "issued": 1325376000000,
                "modified": 1474421403000,
                "language": [
                  {
                    "uri": "http://publications.europa.eu/resource/authority/language/NOR",
                    "code": "NOR",
                    "prefLabel": {
                      "nb": "Norsk"
                    }
                  }
                ],
                "landingPage": [
                  "http://testetaten.no/landingsside/nr1"
                ],
                "theme": [
                  {
                    "uri": "http://publications.europa.eu/resource/authority/data-theme/GOVE",
                    "title": {
                      "nb": "Forvaltning og offentlig støtte"
                    }
                  },
                  {
                    "uri": "http://publications.europa.eu/resource/authority/data-theme/ENVI",
                    "title": {
                      "nb": "Miljø"
                    }
                  }
                ],
                "distribution": [
                  {
                    "id": "96d63bba-e624-4f39-ad26-26b8c6a68880",
                    "uri": "http://brreg.no/catalogs/987654321/datasets/3645d5a8-6689-4fc1-8684-d3d6c2d47386/distributions/96d63bba-e624-4f39-ad26-26b8c6a68880",
                    "description": {
                      "nb": "Dette er beskrivelsen av distribusjonen. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Vestibulum id ligula porta felis euismod semper con desbit arum. Se dokumentasjon for denne distribusjonen."
                    },
                    "accessURL": [
                      "http://www.detteerenlenke.no/til-nedlasting",
                      "http://www.detteerenannenlenke.no/til-en-annen-nedlasting\n",
                      "http://www.detteerentredjelenke.no/til-en-tredje-nedlasting"
                    ],
                    "license": {
                      "uri": "https://www.kartverket.no/geodataarbeid/standarder/sosi/",
                      "prefLabel": {
                        "nb": "SOSI"
                      },
                      "extraType": "dct:Standard"
                    },
                    "page": {
                      "uri": "http://lenke/til/mer/info",
                      "prefLabel": {
                        "nb": "Dokumentasjon av distribusjonen"
                      }
                    },
                    "format": [
                      "application/json"
                    ]
                  }
                ],
                "sample": [
                  {
                    "id": "95a6b5e5-753c-4bc3-a421-2671c8f6a7bb",
                    "uri": "http://brreg.no/catalogs/987654321/datasets/3645d5a8-6689-4fc1-8684-d3d6c2d47386/distributions/95a6b5e5-753c-4bc3-a421-2671c8f6a7bb",
                    "description": {
                      "nb": "Dette er beskrivelsen av eksempeldataene. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor."
                    },
                    "accessURL": [
                      "http://www.detteerenlenke.no/til-nedlasting"
                    ],
                    "format": [
                      "application/rdf+xml"
                    ]
                  }
                ],
                "conformsTo": [
                  {
                    "uri": "https://www.kartverket.no/geodataarbeid/standarder/sosi/",
                    "prefLabel": {
                      "nb": "SOSI"
                    },
                    "extraType": "dct:Standard"
                  }
                ],
                "temporal": [
                  {
                    "startDate": 1483228800000,
                    "endDate": 1514764799000
                  }
                ],
                "spatial": [
                  {
                    "uri": "http://www.geonames.org/3162656/asker.html",
                    "prefLabel": {
                      "nb": "Asker"
                    }
                  },
                  {
                    "uri": "http://www.geonames.org/3162212/baerum.html",
                    "prefLabel": {
                      "nb": "Bærum"
                    }
                  },
                  {
                    "uri": "http://www.geonames.org/3151404/hurum.html",
                    "prefLabel": {
                      "nb": "Hurum"
                    }
                  },
                  {
                    "uri": "http://www.geonames.org/3141104/royken.html",
                    "prefLabel": {
                      "nb": "Røyken"
                    }
                  }
                ],
                "accessRights": {
                  "uri": "http://publications.europa.eu/resource/authority/access-right/RESTRICTED",
                  "code": "RESTRICTED",
                  "prefLabel": {
                    "nb": "Begrenset"
                  }
                },
                "legalBasisForRestriction": [
                  {
                    "uri": "https://lovdata.no/dokument/NL/lov/1992-12-04-126",
                    "prefLabel": {
                      "nb": "Lov om arkiv [arkivlova]"
                    }
                  },
                  {
                    "uri": "http://lovdata/paragraph/20",
                    "prefLabel": {
                      "nb": "Den spesifikke loven § 20"
                    }
                  },
                  {
                    "uri": "http://lovdata/paragraph/26",
                    "prefLabel": {
                      "nb": "Den mindre spesifikke loven § 26"
                    }
                  }
                ],
                "legalBasisForProcessing": [
                  {
                    "uri": "http://lovdata/paragraph/2",
                    "prefLabel": {
                      "nb": "Den andre loven med lenger tittel § 2"
                    }
                  }
                ],
                "legalBasisForAccess": [
                  {
                    "uri": "http://lovdata/paragraph/10",
                    "prefLabel": {
                      "nb": "Den siste loven med den lengste tittelen § 10"
                    }
                  }
                ],
                "hasAccuracyAnnotation": {
                  "inDimension": "Accuracy",
                  "hasBody": {
                    "no": "Denne teksten sier noe om nøyaktigheten. Cras mattis consectetur purus sit."
                  }
                },
                "hasCompletenessAnnotation": {
                  "inDimension": "Completeness",
                  "hasBody": {
                    "no": "Denne teksten sier noe om komplettheten. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras mattis consectetur purus sit amet fermentum."
                  }
                },
                "hasCurrentnessAnnotation": {
                  "inDimension": "Currentness",
                  "hasBody": {
                    "no": "Denne teksten sier noe om aktualiteten. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras mattis consectetur purus sit amet fermentum. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
                  }
                },
                "hasAvailabilityAnnotations": {
                  "inDimension": "Availability",
                  "hasBody": {
                    "no": "Denne teksten sier noe om tilgjengeligheten. Vestibulum id ligula porta felis euismod semper. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Cras mattis consectetur purus sit amet fermentum."
                  }
                },
                "hasRelevanceAnnotation": {
                  "inDimension": "Relevance",
                  "hasBody": {
                    "no": "Denne teksten sier noe om relevansen. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras mattis consectetur purus sit amet fermentum. Cum sociis natoque penatibus et magnis dis parturient montes."
                  }
                },
                "references": [
                  {
                    "referenceType": {
                      "uri": "http://www.w3.org/2002/07/hasVersion",
                      "code": "hasVersion",
                      "prefLabel": {
                        "nb": "Har versjon"
                      }
                    },
                    "source": {
                      "uri": "http://referenced/dataset",
                      "title": {
                        "nb": "The first one"
                      },
                      "description": {},
                      "contactPoint": [],
                      "legalBasisForRestriction": [],
                      "legalBasisForProcessing": [],
                      "legalBasisForAccess": [],
                      "registrationStatus": "DRAFT"
                    }
                  }
                ],
                "provenance": {
                  "uri": "http://data.brreg.no/datakatalog/provenance/vedtak",
                  "code": "vedtak",
                  "prefLabel": {
                    "nb": "Vedtak"
                  }
                },
                "identifier": [
                  "42"
                ],
                "page": [
                  "http://uri1"
                ],
                "accrualPeriodicity": {
                  "uri": "http://publications.europa.eu/resource/authority/frequency/ANNUAL",
                  "code": "ANNUAL",
                  "prefLabel": {
                    "nb": "årlig"
                  }
                },
                "subject": [
                  {
                    "uri": "https://data-david.github.io/Begrep/begrep/Enhet",
                    "prefLabel": {
                      "no": "enhet"
                    },
                    "definition": {
                      "no": "alt som er registrert med et organisasjonsnummer "
                    },
                    "note": {
                      "no": "Alle hovedenheter, underenheter og organisasjonsledd som er identifisert med et organisasjonsnummer."
                    },
                    "source": "https://jira.brreg.no/browse/BEGREP-208"
                  }
                ],
                "informationModel": [
                  {
                    "uri": "https://www.w3.org/2004/02/skos/",
                    "prefLabel": {
                      "nb": "SKOS"
                    }
                  }
                ],
                "type": "Kodeliste",
                "admsIdentifier": [
                  "http://adms.identifier.no/scheme/42"
                ],
                "registrationStatus": "DRAFT"
              }
            } ]
          },
          "aggregations" : {
            "publisherCount" : {
              "doc_count_error_upper_bound" : 0,
              "sum_other_doc_count" : 0,
              "buckets" : [ {
                "key" : "SKATTEETATEN",
                "doc_count" : 1
              } ]
            },
            "theme_count" : {
              "doc_count_error_upper_bound" : 0,
              "sum_other_doc_count" : 0,
              "buckets" : [ {
                "key" : "GOVE",
                "doc_count" : 1
              } ]
            },
            "accessRightCount" : {
              "doc_count_error_upper_bound" : 0,
              "sum_other_doc_count" : 0,
              "buckets" : [ {
                "key" : "RESTRICTED",
                "doc_count" : 1
              } ]
            }
          }
        }
    }
    return mock.response;
    //return response.data
  }

}

import * as React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import DatasetDescription from '../../components/search-dataset-description';
import DatasetKeyInfo from '../../components/search-dataset-keyinfo';
import DatasetDistribution from '../../components/search-dataset-distribution';
import DatasetInfo from '../../components/search-dataset-info';
import DatasetQuality from '../../components/search-dataset-quality-content';
import DatasetBegrep from '../../components/search-dataset-begrep';

export default class DetailsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataset: {
        "id": "3645d5a8-6689-4fc1-8684-d3d6c2d47386",
        "uri": "http://brreg.no/catalogs/987654321/datasets/3645d5a8-6689-4fc1-8684-d3d6c2d47386",
        "catalog": "987654321",
        "title": {
          "nb": "Markagrensen Oslo Kommune og nærliggende kommuner"
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
          "http://testeetatens.no/catalog/2/dataset/42"
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
      ,
      loading: true
    };
    this.loadDatasetFromServer = this.loadDatasetFromServer.bind(this);
  }

  componentDidMount() {
    //this.loadDatasetFromServer();
  }

  // @params: the function has no param but the query need dataset id from prop
  // loads all the info for this dataset
  loadDatasetFromServer() {
    const url = `/detail?id=${this.props.params.id}`;
    axios.get(url)
      .then((res) => {
        const data = res.data;
        const dataset = data.hits.hits[0]._source;
        // ##### MOCK DATA START - please remove when backend is fixed;
        dataset.type = 'Kodelister';
        dataset.conformsTo = ['SOSI'];
        dataset.legalBasisForRestrictions = [
          {
            source: 'http://www.example.com/somepath/somelegalbasis',
            foafHomepage: null,
            prefLabel: {
              nb: 'Den spesifike loven '
            }
          },
          {
            source: 'http://www.example.com/somepath/someotherlegalbasis',
            foafHomepage: null,
            prefLabel: {
              nb: 'Den andre spesifike loven'
            }
          }
        ];
        dataset.legalBasisForProcessings = [
          {
            source: 'http://www.example.com/somepath/someotherlegalbasis',
            foafHomepage: null,
            prefLabel: {
              nb: 'a legalBasisForProcessings that has a long title'
            }
          }
        ];
        dataset.legalBasisForAccesses = [
          {
            source: 'http://www.example.com/somepath/someotherlegalbasis',
            foafHomepage: null,
            prefLabel: {
              nb: 'a legalBasisForAccesses that has a long title'
            }
          }
        ];


        // ### MOCK DATA END
        this.setState({
          dataset,
          loading: false
        });
      });
  }

  _renderDatasetDescription() {
    const dataset = this.state.dataset;
    if (dataset.description) {
      return (
        <DatasetDescription
          title={dataset.title ?
            dataset.title[this.props.selectedLanguageCode]
            || dataset.title.nb
            || dataset.title.nn
            || dataset.title.en
            : null
          }
          description={dataset.description ?
            dataset.description[this.props.selectedLanguageCode]
            || dataset.description.nb
            || dataset.description.nn
            || dataset.description.en
            : null
          }
          publisher={dataset.publisher}
          themes={dataset.theme}
          selectedLanguageCode={this.props.selectedLanguageCode}
        />
      );
    }
    return null;
  }

  _renderDistribution() {
    let distributionNodes;
    const { distribution } = this.state.dataset;
    if (distribution) {
      distributionNodes = distribution.map(distribution => (
        <DatasetDistribution
          id={encodeURIComponent(distribution.id)}
          key={encodeURIComponent(distribution.id)}
          description={distribution.description ?
            distribution.description[this.props.selectedLanguageCode]
            || distribution.description.nb
            || distribution.description.nn
            || distribution.description.en
            : null
          }
          accessUrl={distribution.accessURL}
          format={distribution.format}
          code={this.state.dataset.accessRights ? this.state.dataset.accessRights.code : null}
          selectedLanguageCode={this.props.selectedLanguageCode}
        />
      ));
    }
    return distributionNodes;
  }


  _renderKeyInfo() {
    if (this.state.dataset) {
      return (
        <DatasetKeyInfo
          authorityCode={this.state.dataset.accessRights ? this.state.dataset.accessRights.authorityCode : null}
          selectedLanguageCode={this.props.selectedLanguageCode}
          type={this.state.dataset.type}
          conformsTo={this.state.dataset.conformsTo}
          legalBasisForRestrictions={this.state.dataset.legalBasisForRestrictions}
          legalBasisForProcessings={this.state.dataset.legalBasisForProcessings}
          legalBasisForAccesses={this.state.dataset.legalBasisForAccesses}
        />
      );
    }
    return null;
  }

  _renderDatasetInfo() {
    const {
      issued,
      accrualPeriodicity,
      provenance,
      hasCurrentnessAnnotation,
      spatial,
      temporal,
      language,
      isPartOf,
      references
    } = this.state.dataset;

      return (
        <DatasetInfo
          issued={issued ?
            issued : null
          }
          accrualPeriodicity={accrualPeriodicity ?
            accrualPeriodicity.prefLabel[this.props.selectedLanguageCode]
            || accrualPeriodicity.prefLabel.nb
            || accrualPeriodicity.prefLabel.nn
            || accrualPeriodicity.prefLabel.en
            : null
          }
          provenance={provenance ?
            provenance.prefLabel[this.props.selectedLanguageCode]
            || provenance.prefLabel.nb
            || provenance.prefLabel.nn
            || provenance.prefLabel.en
            : null
          }
          hasCurrentnessAnnotation={hasCurrentnessAnnotation ?
            hasCurrentnessAnnotation.hasBody[this.props.selectedLanguageCode]
            || hasCurrentnessAnnotation.hasBody.nb
            || hasCurrentnessAnnotation.hasBody.nn
            || hasCurrentnessAnnotation.hasBody.no
            || hasCurrentnessAnnotation.hasBody.en
            : null}
          spatial={spatial}
          temporal={temporal}
          language={language}
          isPartOf={isPartOf}
          references={references}
        />
      );
  }

  _renderQuality() {
    const {
      hasRelevanceAnnotation,
      hasCompletenessAnnotation,
      hasAccuracyAnnotation,
      hasAvailabilityAnnotations
    } = this.state.dataset;
    return (
      <DatasetQuality
        relevanceAnnotation={hasRelevanceAnnotation ?
          hasRelevanceAnnotation.hasBody[this.props.selectedLanguageCode]
          || hasRelevanceAnnotation.hasBody.nb
          || hasRelevanceAnnotation.hasBody.no
          || hasRelevanceAnnotation.hasBody.nn
          || hasRelevanceAnnotation.hasBody.en
          : null
        }
        completenessAnnotation={hasCompletenessAnnotation ?
          hasCompletenessAnnotation.hasBody[this.props.selectedLanguageCode]
          || hasCompletenessAnnotation.hasBody.nb
          || hasCompletenessAnnotation.hasBody.no
          || hasCompletenessAnnotation.hasBody.nn
          || hasCompletenessAnnotation.hasBody.en
          : null
        }
        accuracyAnnotation={hasAccuracyAnnotation ?
          hasAccuracyAnnotation.hasBody[this.props.selectedLanguageCode]
          || hasAccuracyAnnotation.hasBody.nb
          || hasAccuracyAnnotation.hasBody.no
          || hasAccuracyAnnotation.hasBody.nn
          || hasAccuracyAnnotation.hasBody.en
          : null
        }
        availabilityAnnotations={hasAvailabilityAnnotations ?
          hasAvailabilityAnnotations.hasBody[this.props.selectedLanguageCode]
          || hasAvailabilityAnnotations.hasBody.nb
          || hasAvailabilityAnnotations.hasBody.no
          || hasAvailabilityAnnotations.hasBody.nn
          || hasAvailabilityAnnotations.hasBody.en
          : null
        }
      />
        );
  }

  _renderContactInfo() {

    return (
      <div />
    );
  }

  render() {
    /*
    {this._renderKeyInfo()}
    */
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-8 col-md-offset-2">
            {this._renderDatasetDescription()}
            {this._renderDistribution()}
            {this._renderDatasetInfo()}
            {this._renderQuality()}


            <DatasetBegrep
              keyword={this.state.dataset.keyword}
            />
          </div>
        </div>
      </div>
    );
  }
}

DetailsPage.propTypes = {
  id: PropTypes.string,
  params: PropTypes.object,
  selectedLanguageCode: PropTypes.string
};

import React from 'react';
import {
  titleValues,
  accessRightsValues,
  themesValues,
  typeValues,
  conceptValues,
  spatialValues,
  provenanceValues,
  contentsValues,
  informationModelValues,
  referenceValues,
  contactPointValues,
  distributionValues,
  sampleValues
} from '../../../src/containers/reg-dataset/logic';

describe('Short text title', () => {
  const values = {
    title: {
      nb: 'Tittel på datasettet'
    },
    description: {
      nb: 'Beskrivelsen skal være kortfattet. Hensikten med datasettet bør komme fram. Hvilke opplysninger som utgjør kjernen i datasettet bør angis. Bruk folkelige ord. Beskriv avgrensninger, hva dataettet ikke inneholder. Begrens lenker og markup.'
    },
    objective: {
      nb: 'Beskrivelsen skal være kortfattet og ikke gjentas i Beskrivelsesfeltet. Dette feltet beskriver formålet.'
    },
    landingPage: [
      'https://google.no'
    ]
  };
  it('should return title values', () => {
    expect(titleValues(values)).not.to.be.equal(null);
  });
});

describe('Short text access rights', () => {
  const values = {
    accessRights: {
      uri: 'http://publications.europa.eu/resource/authority/access-right/RESTRICTED',
      prefLabel: {}
    },
    legalBasisForRestriction: [
      {
        uri: 'http://google.no',
        prefLabel: {
          nb: 'test'
        },
        extraType: null
      }
    ]
  };
  it('should return access right values', () => {
    expect(accessRightsValues(values)).not.to.be.equal(null);
  });
});

describe('Short text themes', () => {
  const values = {
    theme: [
      {
        uri: '',
        title: {
          nb: ''
        }
      },
      {
        uri: 'http://publications.europa.eu/resource/authority/data-theme/AGRI',
        title: {
          nb: 'Jordbruk, fiskeri, skogbruk og mat'
        }
      }
    ]
  };
  it('should return themes values', () => {
    expect(themesValues(values)).not.to.be.equal(null);
  });
});

describe('Short text types', () => {
  const values = {
    type: 'Kodelister'
  };
  it('should return types values', () => {
    expect(typeValues(values)).not.to.be.equal(null);
  });
});

describe('Short text concept', () => {
  const values = {
    subject: [
      {
        uri: 'https://data-david.github.io/Begrep/begrep/Enhet',
        identifier: 'https://data-david.github.io/Begrep/begrep/Enhet',
        prefLabel: {
          no: 'enhet'
        },
        altLabel: null,
        definition: {
          no: 'alt som er registrert med et organisasjonsnummer '
        },
        note: {
          no: 'Alle hovedenheter, underenheter og organisasjonsledd som er identifisert med et organisasjonsnummer.'
        },
        source: 'https://jira.brreg.no/browse/BEGREP-208',
        creator: {
          uri: 'http://data.brreg.no/enhetsregisteret/enhet/974760673'
        },
        inScheme: [
          'http://data-david.github.io/vokabular/Befolkning'
        ]
      }
    ],
    keyword: [
      {
        nb: 'test'
      }
    ]
  };
  it('should return concdept values', () => {
    expect(conceptValues(values)).not.to.be.equal(null);
  });
});

describe('Short text spatial', () => {
  const values = {
    spatial: [
      {
        uri: 'oslo',
        prefLabel: {}
      }
    ],
    temporal: [
      {
        startDate: '2018-02-16',
        endDate: '2018-02-16'
      }
    ],
    issued: '2018-02-07',
    language: [
      {
        uri: 'http://publications.europa.eu/resource/authority/language/ENG',
        code: 'ENG',
        prefLabel: {}
      },
      {
        uri: 'http://publications.europa.eu/resource/authority/language/NOR',
        code: 'NOR',
        prefLabel: {
          nb: 'Norsk'
        }
      }
    ]
  };
  it('should return spatial values', () => {
    expect(spatialValues(values)).not.to.be.equal(null);
  });
});

describe('Short text provenance', () => {
  const values = {
    provenance: {
      uri: 'http://data.brreg.no/datakatalog/provinens/tredjepart',
      code: 'TREDJEPART',
      prefLabel: {
        en: 'Third party',
        nb: 'Tredjepart',
        nn: 'Tredjepart'
      }
    },
    modified: '2018-02-14',
    hasCurrentnessAnnotation: {
      hasBody: {
        no: 'Dette'
      }
    },
    accrualPeriodicity: {
      uri: 'http://publications.europa.eu/resource/authority/frequency/ANNUAL_2',
      code: 'ANNUAL_2',
      prefLabel: {}
    }
  };
  it('should return provenance values', () => {
    expect(provenanceValues(values)).not.to.be.equal(null);
  });
});

describe('Short text contents', () => {
  const values = {
    conformsTo: [
      {
        uri: 'http://google.no',
        prefLabel: {
          nb: 'test'
        },
        extraType: null
      }
    ],
    hasRelevanceAnnotation: {
      inDimension: 'iso:Relevance',
      motivatedBy: 'dqv:qualityAssessment',
      hasBody: {
        nb: 'test12345'
      }
    }
  };
  it('should return contents values', () => {
    expect(contentsValues(values)).not.to.be.equal(null);
  });
});

describe('Short text informationModel', () => {
  const values = {
    informationModel: [
      {
        uri: 'http://google.no',
        prefLabel: {
          nb: 'Standard'
        },
        extraType: null
      }
    ]
  };
  it('should return informationModel values', () => {
    expect(informationModelValues(values)).not.to.be.equal(null);
  });
});

describe('Short text references', () => {
  const values = {
    references: [
      {
        referenceType: {
          uri: 'dct:isPartOf',
          code: 'isPartOf',
          prefLabel: {}
        },
        source: {
          uri: 'http://brreg.no/catalogs/910244132/datasets/1bb96b7b-3278-4286-8a9c-154b24b28a6f',
          prefLabel: null,
          extraType: null
        }
      }
    ]
  };
  it('should return references values', () => {
    expect(referenceValues(values)).not.to.be.equal(null);
  });
});

describe('Short text contactPoint', () => {
  const values = {
    contactPoint: [
      {
        email: 'o@gmail.no',
        organizationUnit: '',
        hasURL: 'http://google.com',
        hasTelephone: '+479701234567'
      }
    ]
  };
  it('should return contactPoint values', () => {
    expect(contactPointValues(values)).not.to.be.equal(null);
  });
});

describe('Short text distribution', () => {
  const values = {
    distribution: [
      {
        id: '',
        description: {
          nb: 'se'
        },
        accessURL: [
          'https://google.no'
        ]
      }
    ]
  };
  it('should return distribution values', () => {
    expect(distributionValues(values)).not.to.be.equal(null);
  });
});

describe('Short text sample', () => {
  const values = {
    sample: [
      {
        id: '',
        description: {
          nb: 'kf'
        },
        accessURL: [
          'http://google.n'
        ]
      }
    ]
  };
  it('should return sample values', () => {
    expect(sampleValues(values)).not.to.be.equal(null);
  });
});

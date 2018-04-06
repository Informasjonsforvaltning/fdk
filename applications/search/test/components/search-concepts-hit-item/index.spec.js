import React from 'react';

import ConceptsHitItem from '../../../src/components/search-concepts-hit-item';

describe('ConceptsHitItem', () => {

  const props =
    {
      _index: 'scat',
      _type: 'subject',
      _id: 'https://data-david.github.io/Begrep/begrep/Enhet',
      _score: 1,
      _source: {
        uri: 'https://data-david.github.io/Begrep/begrep/Enhet',
        identifier: 'https://data-david.github.io/Begrep/begrep/Enhet',
        prefLabel: {
          no: 'enhet'
        },
        definition: {
          no: 'alt som er registrert med et organisasjonsnummer '
        },
        note: {
          no: 'Alle hovedenheter, underenheter og organisasjonsledd som er identifisert med et organisasjonsnummer.'
        },
        source: 'https://jira.brreg.no/browse/BEGREP-208',
        creator: {
          type: 'no.dcat.datastore.domain.dcat.Publisher',
          overordnetEnhet: '912660680',
          organisasjonsform: 'ORGL',
          naeringskode: {
            uri: 'http://www.ssb.no/nace/sn2007/84.110',
            code: '84.110',
            prefLabel: {
              no: 'Generell offentlig administrasjon'
            }
          },
          sektorkode: {
            uri: 'http://www.brreg.no/sektorkode/6100',
            code: '6100',
            prefLabel: {
              no: 'Statsforvaltningen'
            }
          },
          valid: true,
          uri: 'http://data.brreg.no/enhetsregisteret/enhet/974760673',
          id: '974760673',
          name: 'Brønnøysundregistrene',
          orgPath: '/STAT/912660680/974760673'
        },
        inScheme: [
          'http://data-david.github.io/vokabular/Befolkning'
        ],
        datasets: [
          {
            id: 'a5af03f0-0072-403c-9607-2ca62640f26a',
            uri: 'http://data.brreg.no/datakatalog/dataset/974760673/2',
            title: {
              nb: 'Enhetsregisteret',
              en: 'Central Coordinating Register for Legal Entities'
            },
            description: {
              nb: 'Enhetsregisteret inneholder oversikt over alle registrerte enheter Norge innen næringsliv, offentlig og frivillig sektor. Enhetsregisteret tildeler organisasjonsnummer, og samordner opplysninger om næringsliv og offentlige etater som finnes i ulike offentlige registre.',
              en: 'Central Coordinating Register for Legal Entities is a register containing information on all legal entities in Norway - commercial enterprises and government agencies. Includes also businesses sole proprietorships, associations and other economic entities without registration duty, who have chosen to join the CCR on a voluntary basis.'
            }
          }
        ]
      }
    }

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<ConceptsHitItem result={props} />);
  });

  it ('should render', () => {
    expect(wrapper).to.have.length(1);
    expect(wrapper.find('.fdk-a-search-hit')).to.have.length(1);
  });

  it ('should render document count', () => {
    expect(wrapper.find('.fdk-hit-dataset-count')).to.have.length(1);
  });

  it ('should render publisher', () => {
    expect(wrapper.find('.fdk-strong-virksomhet')).to.have.length(1);
  });

});

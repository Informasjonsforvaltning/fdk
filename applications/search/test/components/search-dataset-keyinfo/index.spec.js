import React from 'react';
import DatasetKeyInfo from '../../../src/components/search-dataset-keyinfo';
import LinkExternal from '../../../src/components/search-link-external';

describe('DatasetKeyInfo', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<DatasetKeyInfo />);
  });

  it ('should render', () => {
    expect(wrapper).to.have.length(1);
  });

  it ('should render header', () => {
    wrapper.setProps({
      accessRights: {
        "uri": "http://publications.europa.eu/resource/authority/access-right/RESTRICTED",
        "code": "RESTRICTED",
        "prefLabel": {
          "nb": "Begrenset"
        }
      }
    });
    expect(wrapper.find('.fdk-container-detail-header')).to.have.length(1);
    expect(wrapper.find('.fa-unlock-alt')).to.have.length(1);
  });

  it ('should render legal basis', () => {
    wrapper.setProps({
      legalBasisForRestriction: [
        {
          "uri": "https://lovdata.no/dokument/NL/lov/1992-12-04-126"
        }
      ],
      legalBasisForProcessing: [
        {
          "uri": "http://lovdata/paragraph/2",
          "prefLabel": {
            "nb": "Den andre loven med lenger tittel § 2"
          }
        }
      ],
      legalBasisForAccess: [
        {
          "uri": "http://lovdata/paragraph/10",
          "prefLabel": {
            "nb": "Den siste loven med den lengste tittelen § 10"
          }
        }
      ]
    });
    expect(wrapper.find(LinkExternal)).to.have.length(3);
  });

  it ('should render information model', () => {
    wrapper.setProps({
      informationModel : [ {
        "uri" : "https://confluence.brreg.no/display/DBNPUB/Informasjonsmodell+for+Enhetsregisteret+og+Foretaksregisteret",
        "prefLabel" : {
          "nb" : "Informasjonsmodell for Enhetsregisteret og Foretaksregisteret "
        },
        "extraType" : "http://purl.org/dc/terms/Standard"
      } ]
    });
    expect(wrapper.find(LinkExternal)).to.have.length(1);
  });

  it ('should render conforms to', () => {
    wrapper.setProps({
      conformsTo: [
        {
          "uri": "https://www.kartverket.no/geodataarbeid/standarder/sosi/",
          "prefLabel": {
            "nb": "SOSI"
          },
          "extraType": "http://purl.org/dc/terms/Standard"
        }
      ]
    });
    expect(wrapper.find(LinkExternal)).to.have.length(1);
  });
});

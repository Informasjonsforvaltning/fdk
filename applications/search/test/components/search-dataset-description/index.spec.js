import React from 'react';
import DatasetDescription from '../../../src/components/search-dataset-description';

describe('DatasetDescription', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<DatasetDescription/>);
  });

  it ('should render', () => {
    expect(wrapper).to.have.length(1);
    expect(wrapper.find('#dataset-description').length).to.be.equal(1);
  });

  it ('should render title', () => {
    wrapper.setProps({ title: 'tittel'});
    expect(wrapper.find('h1.fdk-margin-bottom').length).to.be.equal(1);
  });

  it ('should render title', () => {
    wrapper.setProps({ title: 'tittel'});
    expect(wrapper.find('h1.fdk-margin-bottom').length).to.be.equal(1);
  });

  it ('should render description', () => {
    wrapper.setProps({ description: 'description'});
    expect(wrapper.find('p.fdk-ingress').length).to.be.equal(1);
  });

  it ('should render publisher with link', () => {
    wrapper.setProps({
      "publisher": {
        "id": "http://data.brreg.no/enhetsregisteret/enhet/974761076",
        "name": "SKATTEETATEN",
      }
    });
    expect(wrapper.find('#dataset-descritption-publisher-text').length).to.be.equal(1);
    expect(wrapper.find('#dataset-descritption-publisher-link').length).to.be.equal(1);
  });

  it ('should render publisher without link', () => {
    wrapper.setProps({
      "publisher": {
        "name": "SKATTEETATEN",
      }
    });
    expect(wrapper.find('#dataset-descritption-publisher-text').length).to.be.equal(1);
    expect(wrapper.find('#dataset-descritption-publisher-link').length).to.be.equal(0);
  });

  it ('should render themes', () => {
    wrapper.setProps({
      "selectedLanguageCode": 'nb',
      "themes": [{
        "id" : "http://publications.europa.eu/resource/authority/data-theme/GOVE",
        "code" : "GOVE",
        "startUse" : "2015-10-01",
        "title" : {
          "nb" : "Forvaltning og offentlig sektor",
        }
      }]
    });
    expect(wrapper.find('#dataset-description-theme').length).to.be.equal(1);
  });
});

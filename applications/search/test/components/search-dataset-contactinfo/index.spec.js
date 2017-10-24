import React from 'react';
import DatasetContactInfo from '../../../src/components/search-dataset-contactinfo';

describe('DatasetContactInfo', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<DatasetContactInfo/>);
  });

  it ('should render', () => {
    expect(wrapper).to.have.length(1);
    expect(wrapper.find('#dataset-contactinfo')).to.have.length(1);
  });

  it ('should render uri href', () => {
    wrapper.setProps({
      contactPoint:
        {
          "id": "4e47a7d1-804d-4617-8be9-133d1d358a5e",
          "uri": "http://contact/4e47a7d1-804d-4617-8be9-133d1d358a5e",
          "email": "digitalisering@kartverket.no",
          "organizationUnit": "Avdeling for digitalisering",
          "hasURL": "http://testetaten.no/url",
          "hasTelephone": "22306022"
        }
    });
    expect(wrapper.find('#dataset-contact-url')).to.have.length(1);
  });
});

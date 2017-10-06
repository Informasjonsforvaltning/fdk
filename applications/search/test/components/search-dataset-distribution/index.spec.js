import React from 'react';
import DatasetDistribution from '../../../src/components/search-dataset-distribution';
import DatasetFormat from '../../../src/components/search-dataset-format';

describe('DatasetDistribution', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<DatasetDistribution />);
  });

  it ('should render', () => {
    expect(wrapper).to.have.length(1);
    expect(wrapper.find('#dataset-distribution')).to.have.length(1);
  });

  it ('should render description', () => {
    wrapper.setProps({ description: 'description'});
    expect(wrapper.find('#dataset-distribution-description')).to.have.length(1);
  });

  it ('should render access url', () => {
    wrapper.setProps({ accessUrl: 'test-link'});
    expect(wrapper.find('#dataset-distribution-accessurl')).to.have.length(1);
  });

  it ('should render format', () => {
    wrapper.setProps({
      "format" : "text/html"
    });
    expect(wrapper.find(DatasetFormat)).to.have.length(1);
    expect(wrapper.find(DatasetFormat).dive().find('.fdk-label-distribution')).to.have.length(1);
  })
});

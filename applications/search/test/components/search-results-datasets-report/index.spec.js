import React from 'react';
import sinon from 'sinon';

import ResultsDatasetsReport from '../../../src/components/search-results-datasets-report';
import SearchPublishers from '../../../src/components/search-results-dataset-report-publisher';
import PublisherTree from '../../../src/components/search-publishers-tree';

describe('ResultsDatasetsReport', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<ResultsDatasetsReport/>);
  });

  it ('should render', () => {
    expect(wrapper).to.have.length(1);
    expect(wrapper.find(SearchPublishers)).to.have.length(1);
    expect(wrapper.find(PublisherTree)).to.have.length(1);
  });

  it ('clear button should clear state', () => {
    wrapper.setProps({
      value: 'NAV'
    });
    wrapper.find('button').simulate('click');
    expect(wrapper.state().value).to.equal('');
  });
});



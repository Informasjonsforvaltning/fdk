import React from 'react';
import sinon from 'sinon';
import { Link } from 'react-router-dom';

import ResultTabs from '../../../src/components/search-results-tabs';

describe('ResultTabs', () => {
  let wrapper;
  const defaultProps = {
    location: {
      pathname: "/",
      search: "",
      hash: "",
      key: "ublg0e"
    }
  };

  it ('should render', () => {
    wrapper = shallow(<ResultTabs {...defaultProps} />);
    expect(wrapper).to.have.length(1);
    expect(wrapper.find('.search-results-tabs')).to.have.length(1);
    expect(wrapper.find(Link)).to.have.length(2);
  });

});



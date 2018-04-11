import React from 'react';
import { shallow } from 'enzyme';
 import ResultTabs from '../../../src/components/search-results-tabs';

test('should render ResultTabs correctly', () => {
  const defaultProps = {
    location: {
      pathname: "/",
      search: "",
      hash: "",
      key: "ublg0e"
    }
  };
  const wrapper = shallow(<ResultTabs {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();

});





/*
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
*/


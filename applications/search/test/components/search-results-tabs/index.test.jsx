import React from 'react';
import { shallow } from 'enzyme';
import ResultTabs from '../../../src/components/search-results-tabs';

test('should render ResultTabs with "Dataset" active correctly', () => {
  const defaultProps = {
    location: {
      pathname: '/',
      search: '',
      hash: '',
      key: 'ublg0e'
    }
  };
  const wrapper = shallow(<ResultTabs {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});

test('should render ResultTabs with "Concepts" active correctly', () => {
  const defaultProps = {
    location: {
      pathname: '/concepts',
      search: '',
      hash: '',
      key: 'ublg0e'
    }
  };
  const wrapper = shallow(<ResultTabs {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});

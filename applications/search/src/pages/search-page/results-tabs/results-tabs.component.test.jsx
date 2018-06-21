import React from 'react';
import { shallow } from 'enzyme';
import { ResultsTabs } from './results-tabs.component';

test('should render ResultsTabs with "Dataset" active correctly', () => {
  const defaultProps = {
    location: {
      pathname: '/',
      search: '',
      hash: '',
      key: 'ublg0e'
    }
  };
  const wrapper = shallow(<ResultsTabs {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});

test('should render ResultsTabs with "Concepts" active correctly', () => {
  const defaultProps = {
    location: {
      pathname: '/concepts',
      search: '',
      hash: '',
      key: 'ublg0e'
    }
  };
  const wrapper = shallow(<ResultsTabs {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});

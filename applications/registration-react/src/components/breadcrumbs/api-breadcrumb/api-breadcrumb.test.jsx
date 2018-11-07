import React from 'react';
import { shallow } from 'enzyme';
import { PureApiBreadcrumb } from './api-breadcrumb';

test('should render PureApiBreadcrumb with "Dataset" active correctly', () => {
  const defaultProps = {
    apiItem: {
      title: 'api title'
    }
  };
  const wrapper = shallow(<PureApiBreadcrumb {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});

test('should render PureApiBreadcrumb correctly with no apiItem', () => {
  const defaultProps = {};
  const wrapper = shallow(<PureApiBreadcrumb {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});

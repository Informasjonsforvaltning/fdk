import React from 'react';
import { shallow } from 'enzyme';
import { ApiBreadcrumb } from './api-breadcrumb';

test('should render ApiBreadcrumb with "Dataset" active correctly', () => {
  const defaultProps = {
    apiItem: {
      title: 'api title'
    }
  };
  const wrapper = shallow(<ApiBreadcrumb {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});

test('should render ApiBreadcrumb correctly with no apiItem', () => {
  const defaultProps = {};
  const wrapper = shallow(<ApiBreadcrumb {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});

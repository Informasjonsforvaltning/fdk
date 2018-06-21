import React from 'react';
import { shallow } from 'enzyme';
import { PathNameBreadcrumb } from './pathname-breadcrumb';

test('should render PathNameBreadcrumb  correctly', () => {
  const defaultProps = {
    pathname: 'about'
  };
  const wrapper = shallow(<PathNameBreadcrumb {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});

test('should render PathNameBreadcrumb correctly with no pathname', () => {
  const defaultProps = {};
  const wrapper = shallow(<PathNameBreadcrumb {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});

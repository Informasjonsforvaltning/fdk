import React from 'react';
import { shallow } from 'enzyme';
import PurePathNameBreadcrumb from '../../../src/components/search-app-breadcrumbs-pathname';

test('should render PurePathNameBreadcrumb  correctly', () => {
  const defaultProps = {
    pathname: 'about'
  };
  const wrapper = shallow(<PurePathNameBreadcrumb {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});

test('should render PurePathNameBreadcrumb correctly with no pathname', () => {
  const defaultProps = {};
  const wrapper = shallow(<PurePathNameBreadcrumb {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});

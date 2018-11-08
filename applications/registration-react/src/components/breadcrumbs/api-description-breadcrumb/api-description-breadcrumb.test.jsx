import React from 'react';
import { shallow } from 'enzyme';
import { PureapiDescriptionBreadcrumb } from './api-description-breadcrumb';

test('should render Pureapi-descriptionBreadcrumb with "api-description" active correctly', () => {
  const defaultProps = {
    apiDescriptionItem: {
      title: 'api-description title'
    }
  };
  const wrapper = shallow(<PureapiDescriptionBreadcrumb {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});

test('should render Pureapi-descriptionBreadcrumb correctly with no api-descriptionItem', () => {
  const defaultProps = {};
  const wrapper = shallow(<PureapiDescriptionBreadcrumb {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});

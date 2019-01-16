import React from 'react';
import { shallow } from 'enzyme';
import { PureInformationModelBreadcrumb } from './information-breadcrumb';

test('should render PureInformationModelBreadcrumb with "Dataset" active correctly', () => {
  const defaultProps = {
    informationModelItem: {
      title: 'api title'
    }
  };
  const wrapper = shallow(<PureInformationModelBreadcrumb {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});

test('should render PureInformationModelBreadcrumb correctly with no informationModelItem', () => {
  const defaultProps = {};
  const wrapper = shallow(<PureInformationModelBreadcrumb {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});

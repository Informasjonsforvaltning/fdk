import React from 'react';
import { shallow } from 'enzyme';
import { PuredatasetBreadcrumb } from './dataset-breadcrumb';

test('should render PuredatasetBreadcrumb with "dataset" active correctly', () => {
  const defaultProps = {
    datasetItem: {
      title: 'dataset title'
    }
  };
  const wrapper = shallow(<PuredatasetBreadcrumb {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});

test('should render PuredatasetBreadcrumb correctly with no datasetItem', () => {
  const defaultProps = {};
  const wrapper = shallow(<PuredatasetBreadcrumb {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});

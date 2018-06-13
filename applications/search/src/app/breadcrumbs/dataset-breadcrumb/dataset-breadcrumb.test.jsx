import React from 'react';
import { shallow } from 'enzyme';
import { PureDatasetBreadcrumb } from './dataset-breadcrumb';

test('should render PureDatasetBreadcrumb with "Dataset" active correctly', () => {
  const defaultProps = {
    datasetItem: {
      title: 'dataset title'
    }
  };
  const wrapper = shallow(<PureDatasetBreadcrumb {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});

test('should render PureDatasetBreadcrumb correctly with no datasetItem', () => {
  const defaultProps = {};
  const wrapper = shallow(<PureDatasetBreadcrumb {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});

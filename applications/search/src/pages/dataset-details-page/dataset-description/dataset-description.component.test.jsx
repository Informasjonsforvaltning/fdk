import React from 'react';
import { shallow } from 'enzyme';
import { DatasetDescription } from './dataset-description.component';
import dataset from '../__fixtures/datasetApiResponse.json';

test('should render DatasetDescription correctly with no props', () => {
  const minWrapper = shallow(<DatasetDescription />);
  expect(minWrapper).toMatchSnapshot();
});

test('should render DatasetDescription correctly', () => {
  const defaultProps = {
    datasetItem: dataset
  };
  const wrapper = shallow(<DatasetDescription {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});

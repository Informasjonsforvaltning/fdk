import React from 'react';
import { shallow } from 'enzyme';
import { DatasetReference } from './dataset-reference.component';
import datasetItem from './__fixtures/datasetItem.json';

let defaultProps;

test('should render DatasetReference correctly with no props', () => {
  const wrapper = shallow(<DatasetReference />);
  expect(wrapper).toMatchSnapshot();
});

test('should render DatasetReference correctly', () => {
  defaultProps = {
    datasetReference: datasetItem,
    index: 0
  };
  const wrapper = shallow(<DatasetReference {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});

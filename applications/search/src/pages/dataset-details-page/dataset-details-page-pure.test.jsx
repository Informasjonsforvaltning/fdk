import React from 'react';
import { shallow } from 'enzyme';
import { DatasetDetailsPagePure } from './dataset-details-page-pure';
import datasetItem from './__fixtures/datasetApiResponse.json';

let wrapper;

beforeEach(() => {
  wrapper = shallow(<DatasetDetailsPagePure datasetItem={datasetItem} />);
});

test('should render DatasetDetailsPagePure correctly with no datasetItem', () => {
  const wrap = shallow(<DatasetDetailsPagePure />);
  expect(wrap).toMatchSnapshot();
});

test('should render DatasetDetailsPagePure correctly with datasetItem', () => {
  expect(wrapper).toMatchSnapshot();
});

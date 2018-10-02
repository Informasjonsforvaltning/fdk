import React from 'react';
import { shallow } from 'enzyme';
import { DatasetDetailsPage } from './dataset-details-page';
import datasetItem from './__fixtures/datasetApiResponse.json';

let wrapper;

beforeEach(() => {
  wrapper = shallow(<DatasetDetailsPage datasetItem={datasetItem} />);
});

test('should render DatasetDetailsPage correctly with no datasetItem', () => {
  const wrap = shallow(<DatasetDetailsPage />);
  expect(wrap).toMatchSnapshot();
});

test('should render DatasetDetailsPage correctly with datasetItem', () => {
  expect(wrapper).toMatchSnapshot();
});

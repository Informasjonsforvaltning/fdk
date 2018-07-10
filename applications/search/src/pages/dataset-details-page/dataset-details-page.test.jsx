import React from 'react';
import { shallow } from 'enzyme';
import { DatasetDetailsPage } from './dataset-details-page';
import datasets from '../../../test/fixtures/datasets';

let wrapper;

beforeEach(() => {
  wrapper = shallow(
    <DatasetDetailsPage
      datasetItem={datasets[0]._source}
      isFetchingDataset={false}
    />
  );
});

test('should render DatasetDetailsPage correctly with no datasetItem', () => {
  const wrap = shallow(<DatasetDetailsPage />);
  expect(wrap).toMatchSnapshot();
});

test('should render DatasetDetailsPage correctly with datasetItem', () => {
  expect(wrapper).toMatchSnapshot();
});

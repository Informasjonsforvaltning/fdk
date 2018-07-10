import React from 'react';
import { shallow } from 'enzyme';
import { DetailsPage } from './details-page';
import datasets from '../../../test/fixtures/datasets';

let wrapper;

beforeEach(() => {
  wrapper = shallow(
    <DetailsPage datasetItem={datasets[0]._source} isFetchingDataset={false} />
  );
});

test('should render DetailsPage correctly with no datasetItem', () => {
  const wrap = shallow(<DetailsPage />);
  expect(wrap).toMatchSnapshot();
});

test('should render DetailsPage correctly with datasetItem', () => {
  expect(wrapper).toMatchSnapshot();
});

import React from 'react';
import { shallow } from 'enzyme';
import { DetailsPage } from '../../../src/containers/search-detailspage';
import datasets from '../../fixtures/datasets';

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

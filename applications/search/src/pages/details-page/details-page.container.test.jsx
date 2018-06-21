import React from 'react';
import { shallow } from 'enzyme';
import { PureDetailsPage } from './details-page.container';
import datasets from '../../../test/fixtures/datasets';

let wrapper;

beforeEach(() => {
  wrapper = shallow(
    <PureDetailsPage
      datasetItem={datasets[0]._source}
      isFetchingDataset={false}
    />
  );
});

test('should render PureDetailsPage correctly with no datasetItem', () => {
  const wrap = shallow(<PureDetailsPage />);
  expect(wrap).toMatchSnapshot();
});

test('should render PureDetailsPage correctly with datasetItem', () => {
  expect(wrapper).toMatchSnapshot();
});

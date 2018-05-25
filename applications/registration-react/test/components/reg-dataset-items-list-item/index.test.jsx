import React from 'react';
import { shallow } from 'enzyme';
import DatasetItemsListItem from '../../../src/components/reg-dataset-items-list-item';
import datasets from '../../fixtures/datasets';

let defaultProps;
let wrapper;

beforeEach(() => {
  const item = datasets.datasetItems._embedded.datasets[0];
  defaultProps = {
    catalogId: '123',
    item
  };
  wrapper = shallow(<DatasetItemsListItem {...defaultProps} />);
});

test('should render DatasetItemsListItem correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

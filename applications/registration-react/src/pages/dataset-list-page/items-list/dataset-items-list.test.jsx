import React from 'react';
import { shallow } from 'enzyme';
import { DatasetItemsList } from './dataset-item-list.component';
import datasetsResponse from '../../../mock/datasets.response.json';

const {
  _embedded: { datasets: datasetItems }
} = datasetsResponse;

let defaultProps;
let wrapper;

beforeEach(() => {
  defaultProps = {
    catalogId: '123'
  };
  wrapper = shallow(<DatasetItemsList {...defaultProps} />);
});

test('should render DatasetItemsList correctly with missing datasetItems', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should render DatasetItemsList correctly with datasetItems', () => {
  wrapper.setProps({
    datasetItems
  });
  expect(wrapper).toMatchSnapshot();
});

test('should render DatasetItemsList correctly with missing items', () => {
  wrapper.setProps({
    datasetItems: null
  });
  expect(wrapper).toMatchSnapshot();
});

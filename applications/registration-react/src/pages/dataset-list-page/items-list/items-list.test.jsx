import React from 'react';
import { shallow } from 'enzyme';
import DatasetItemsList from './item-list.component';
import datasets from '../../../../test/fixtures/datasets';

let defaultProps;
let wrapper;

beforeEach(() => {
  const { datasetItems } = datasets;
  defaultProps = {
    catalogId: '123',
    datasetItems
  };
  wrapper = shallow(<DatasetItemsList {...defaultProps} />);
});

test('should render DatasetItemsList correctly with missing datasetItems', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should render DatasetItemsList correctly with datasetItems', () => {
  const { datasetItems } = datasets;
  wrapper.setProps({
    datasetItems
  });
  expect(wrapper).toMatchSnapshot();
});

test('should render DatasetItemsList correctly sortField equal title', () => {
  wrapper.setState({
    sortField: 'title'
  });
  expect(wrapper).toMatchSnapshot();
});

test('should render DatasetItemsList correctly sortField equal title', () => {
  wrapper.setState({
    sortField: 'registrationStatus'
  });
  expect(wrapper).toMatchSnapshot();
});

test('should render DatasetItemsList correctly with missing items', () => {
  wrapper.setProps({
    datasetItems: null
  });
  expect(wrapper).toMatchSnapshot();
});

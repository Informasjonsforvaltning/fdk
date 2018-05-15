import React from 'react';
import { shallow } from 'enzyme';
import DatasetItemsList from '../../../src/components/reg-dataset-items-list';
import datasets from '../../fixtures/datasets';

let defaultProps, wrapper, refreshSession, toggle;

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
  const { datasetItems } = datasets;
  wrapper.setProps({
    datasetItems
  })
  expect(wrapper).toMatchSnapshot();
});

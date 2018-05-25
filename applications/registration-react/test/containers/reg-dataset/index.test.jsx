import React from 'react';
import { shallow } from 'enzyme';
import { createMockStore } from 'redux-test-utils';
import shallowWithStore from '../../shallowWithStore';
import RegDatasetComponent, {
  RegDataset
} from '../../../src/containers/reg-dataset';
import dataset from '../../fixtures/datasets';
import helptexts from '../../fixtures/helptext';

let defaultProps;
let wrapper;
let dispatch;

beforeEach(() => {
  dispatch = jest.fn();
  defaultProps = {
    dispatch,
    helptextItems: helptexts.helptextItems,
    isFetching: false
  };
  wrapper = shallow(<RegDataset {...defaultProps} />);
});

test('should render RegDataset correctly', () => {
  expect(wrapper).toHaveLength(1);
  expect(wrapper).toMatchSnapshot();
});

test('should render FormAccessRightsSchema correctly', () => {
  const testState = {
    dataset: dataset.datasetItems._embedded.datasets[0],
    helptexts,
    form: null
  };
  const store = createMockStore(testState);
  wrapper = shallowWithStore(<RegDatasetComponent />, store);
  expect(wrapper).toHaveLength(1);
});

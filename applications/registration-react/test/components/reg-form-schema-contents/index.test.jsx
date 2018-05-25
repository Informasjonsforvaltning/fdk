import React from 'react';
import { createMockStore } from 'redux-test-utils';
import shallowWithStore from '../../shallowWithStore';
import FormContents from '../../../src/components/reg-form-schema-contents/index';
import dataset from '../../fixtures/datasets';

let wrapper;

test('should render FormContents correctly', () => {
  const testState = {
    dataset: {
      result: dataset.datasetItems._embedded.datasets[0]
    }
  };
  const store = createMockStore(testState);
  wrapper = shallowWithStore(<FormContents />, store);
  expect(wrapper).toHaveLength(1);
});

import React from 'react';
import { createMockStore } from 'redux-test-utils';
import shallowWithStore from '../../../../test/shallowWithStore';
import FormContactPoint from './connected-form-contactPoint.component';
import dataset from '../../../../test/fixtures/datasets';

let wrapper;

test('should render FormContactPoint correctly', () => {
  const testState = {
    dataset: {
      result: dataset.datasetItems._embedded.datasets[0]
    }
  };
  const store = createMockStore(testState);
  wrapper = shallowWithStore(<FormContactPoint />, store);
  expect(wrapper).toHaveLength(1);
});

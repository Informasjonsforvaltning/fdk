import React from 'react';
import { createMockStore } from 'redux-test-utils';
import shallowWithStore from '../../shallowWithStore';
import FormContactPoint from '../../../src/components/reg-form-schema-contactPoint/index';
import dataset from '../../fixtures/datasets';

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

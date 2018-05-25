import React from 'react';
import { createMockStore } from 'redux-test-utils';
import shallowWithStore from '../../shallowWithStore';
import FormType from '../../../src/components/reg-form-schema-type/index';
import dataset from '../../fixtures/datasets';

test('should render FormType correctly', () => {
  const testState = {
    dataset: {
      result: dataset.datasetItems._embedded.datasets[0]
    }
  };
  const store = createMockStore(testState);
  const wrapper = shallowWithStore(<FormType />, store);
  expect(wrapper).toHaveLength(1);
});

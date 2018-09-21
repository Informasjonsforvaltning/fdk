import React from 'react';
import { createMockStore } from 'redux-test-utils';
import shallowWithStore from '../../../../test/shallowWithStore';
import FormConcept from './connected-form-concept.component';
import dataset from '../../../../test/fixtures/datasets';

let wrapper;

test('should render FormConcept correctly', () => {
  const testState = {
    dataset: {
      result: dataset.datasetItems._embedded.datasets[0]
    }
  };
  const store = createMockStore(testState);
  wrapper = shallowWithStore(<FormConcept />, store);
  expect(wrapper).toHaveLength(1);
});

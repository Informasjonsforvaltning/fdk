import React from 'react';
import { createMockStore } from 'redux-test-utils';
import shallowWithStore from '../../../../test/shallowWithStore';
import FormDistribution from './connected-form-distribution.component';
import dataset from '../../../../test/fixtures/datasets';
import openlicenses from '../../../../test/fixtures/openlicenses';

test('should render FormDistribution correctly', () => {
  const testState = {
    dataset: {
      result: dataset.datasetItems._embedded.datasets[0]
    },
    openlicenses
  };
  const store = createMockStore(testState);
  const wrapper = shallowWithStore(<FormDistribution />, store);
  expect(wrapper).toHaveLength(1);
});

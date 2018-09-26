import React from 'react';
import { createMockStore } from 'redux-test-utils';
import shallowWithStore from '../../shallowWithStore';
import FormDistribution from '../../../src/components/reg-form-schema-distribution/index';
import dataset from '../../fixtures/datasets';
import openlicenses from '../../fixtures/openlicenses';

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

import React from 'react';
import { createMockStore } from 'redux-test-utils';
import shallowWithStore from '../../shallowWithStore';
import FormSpatial from '../../../src/components/reg-form-schema-spatial/index';
import dataset from '../../fixtures/datasets';

test('should render FormSpatial correctly', () => {
  const testState = {
    dataset: {
      result: dataset.datasetItems._embedded.datasets[0]
    }
  };
  const store = createMockStore(testState);
  const wrapper = shallowWithStore(<FormSpatial />, store);
  expect(wrapper).toHaveLength(1);
});

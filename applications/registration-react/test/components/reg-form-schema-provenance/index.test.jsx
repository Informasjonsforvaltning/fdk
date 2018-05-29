import React from 'react';
import { createMockStore } from 'redux-test-utils';
import shallowWithStore from '../../shallowWithStore';
import FormProvenance from '../../../src/components/reg-form-schema-provenance/index';
import dataset from '../../fixtures/datasets';
import frequency from '../../fixtures/frequency';
import provenance from '../../fixtures/provenance';

test('should render FormProvenance correctly', () => {
  const testState = {
    dataset: {
      result: dataset.datasetItems._embedded.datasets[0]
    },
    frequency,
    provenance
  };
  const store = createMockStore(testState);
  const wrapper = shallowWithStore(<FormProvenance />, store);
  expect(wrapper).toHaveLength(1);
});

import React from 'react';
import { createMockStore } from 'redux-test-utils';
import shallowWithStore from '../../../../test/shallowWithStore';
import FormProvenance from './connected-form-provenance.component';
import dataset from '../../../../test/fixtures/datasets';
import frequency from '../../../../test/fixtures/frequency';
import provenance from '../../../../test/fixtures/provenance';

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

import React from 'react';
import { createMockStore } from 'redux-test-utils';
import shallowWithStore from '../../../../test/shallowWithStore';
import FormTitle from './connected-form-title.component';
import dataset from '../../../../test/fixtures/datasets';

test('should render FormTitle correctly', () => {
  const testState = {
    dataset: {
      result: dataset.datasetItems._embedded.datasets[0]
    }
  };
  const store = createMockStore(testState);
  const wrapper = shallowWithStore(<FormTitle />, store);
  expect(wrapper).toHaveLength(1);
});

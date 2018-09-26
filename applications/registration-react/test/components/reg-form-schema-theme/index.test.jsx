import React from 'react';
import { createMockStore } from 'redux-test-utils';
import shallowWithStore from '../../shallowWithStore';
import FormThemes from '../../../src/components/reg-form-schema-theme/index';
import dataset from '../../fixtures/datasets';
import themes from '../../fixtures/themes';

test('should render FormThemes correctly', () => {
  const testState = {
    dataset: {
      result: dataset.datasetItems._embedded.datasets[0]
    },
    themes
  };
  const store = createMockStore(testState);
  const wrapper = shallowWithStore(<FormThemes />, store);
  expect(wrapper).toHaveLength(1);
});

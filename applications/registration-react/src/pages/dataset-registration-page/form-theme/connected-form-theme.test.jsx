import React from 'react';
import { createMockStore } from 'redux-test-utils';
import shallowWithStore from '../../../../test/shallowWithStore';
import FormThemes from './connected-form-theme.component';
import dataset from '../../../../test/fixtures/datasets';
import themes from '../../../../test/fixtures/themes';

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

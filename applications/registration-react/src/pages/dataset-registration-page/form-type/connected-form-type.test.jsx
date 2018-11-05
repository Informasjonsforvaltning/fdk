import React from 'react';
import { createMockStore } from 'redux-test-utils';
import shallowWithStore from '../../../../test/shallowWithStore';
import { ConnectedFormType } from './connected-form-type.component';
import dataset from '../../../../test/fixtures/datasets';

test('should render ConnectedFormType correctly', () => {
  const testState = {};
  const store = createMockStore(testState);
  const datasetItem = dataset.datasetItems._embedded.datasets[0];
  const wrapper = shallowWithStore(
    <ConnectedFormType datasetItem={datasetItem} />,
    store
  );
  expect(wrapper).toHaveLength(1);
});

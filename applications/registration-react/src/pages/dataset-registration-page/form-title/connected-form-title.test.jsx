import React from 'react';
import { createMockStore } from 'redux-test-utils';
import shallowWithStore from '../../../../test/shallowWithStore';
import { ConnectedFormTitle } from './connected-form-title.component';
import dataset from '../../../../test/fixtures/datasets';

test('should render ConnectedFormTitle correctly', () => {
  const testState = {};
  const store = createMockStore(testState);
  const datasetItem = dataset.datasetItems._embedded.datasets[0];
  const wrapper = shallowWithStore(
    <ConnectedFormTitle datasetItem={datasetItem} />,
    store
  );
  expect(wrapper).toHaveLength(1);
});

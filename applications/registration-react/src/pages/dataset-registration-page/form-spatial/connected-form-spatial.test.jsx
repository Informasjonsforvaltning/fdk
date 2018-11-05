import React from 'react';
import { createMockStore } from 'redux-test-utils';
import shallowWithStore from '../../../../test/shallowWithStore';
import { ConnectedFormSpatial } from './connected-form-spatial.component';
import dataset from '../../../../test/fixtures/datasets';

test('should render ConnectedFormSpatial correctly', () => {
  const testState = {};
  const store = createMockStore(testState);
  const datasetItem = dataset.datasetItems._embedded.datasets[0];
  const wrapper = shallowWithStore(
    <ConnectedFormSpatial datasetItem={datasetItem} />,
    store
  );
  expect(wrapper).toHaveLength(1);
});

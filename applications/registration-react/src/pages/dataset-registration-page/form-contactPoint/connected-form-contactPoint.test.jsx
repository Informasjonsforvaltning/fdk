import React from 'react';
import { createMockStore } from 'redux-test-utils';
import shallowWithStore from '../../../../test/shallowWithStore';
import { ConnectedFormContactPoint } from './connected-form-contactPoint.component';
import dataset from '../../../../test/fixtures/datasets';

let wrapper;

test('should render ConnectedFormContactPoint correctly', () => {
  const testState = {};
  const store = createMockStore(testState);
  const datasetItem = dataset.datasetItems._embedded.datasets[0];
  wrapper = shallowWithStore(
    <ConnectedFormContactPoint datasetItem={datasetItem} />,
    store
  );
  expect(wrapper).toHaveLength(1);
});

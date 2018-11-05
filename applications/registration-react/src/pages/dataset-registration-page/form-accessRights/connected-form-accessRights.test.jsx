import React from 'react';
import { createMockStore } from 'redux-test-utils';
import shallowWithStore from '../../../../test/shallowWithStore';
import { ConnectedFormAccessRights } from './connected-form-accessRights.component';
import dataset from '../../../../test/fixtures/datasets';

let wrapper;

test('should render ConnectedFormAccessRights correctly', () => {
  const testState = {};
  const store = createMockStore(testState);
  const datasetItem = dataset.datasetItems._embedded.datasets[0];
  wrapper = shallowWithStore(
    <ConnectedFormAccessRights datasetItem={datasetItem} />,
    store
  );
  expect(wrapper).toHaveLength(1);
});

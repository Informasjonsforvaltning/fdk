import React from 'react';
import { createMockStore } from 'redux-test-utils';
import shallowWithStore from '../../../../test/shallowWithStore';
import { ConnectedFormContents } from './connected-form-contents.component';
import dataset from '../../../../test/fixtures/datasets';

let wrapper;

test('should render ConnectedFormContents correctly', () => {
  const testState = {};
  const store = createMockStore(testState);
  const datasetItem = dataset.datasetItems._embedded.datasets[0];
  wrapper = shallowWithStore(
    <ConnectedFormContents datasetItem={datasetItem} />,
    store
  );
  expect(wrapper).toHaveLength(1);
});

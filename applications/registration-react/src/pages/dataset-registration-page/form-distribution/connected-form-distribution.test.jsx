import React from 'react';
import { createMockStore } from 'redux-test-utils';
import shallowWithStore from '../../../../test/shallowWithStore';
import { ConnectedFormDistribution } from './connected-form-distribution.component';
import dataset from '../../../../test/fixtures/datasets';
import openlicenses from '../../../../test/fixtures/openlicenses';

test('should render ConnectedFormDistribution correctly', () => {
  const testState = {};
  const store = createMockStore(testState);
  const datasetItem = dataset.datasetItems._embedded.datasets[0];
  const { openLicenseItems } = openlicenses;

  const wrapper = shallowWithStore(
    <ConnectedFormDistribution
      datasetItem={datasetItem}
      openLicenseItems={openLicenseItems}
    />,
    store
  );
  expect(wrapper).toHaveLength(1);
});

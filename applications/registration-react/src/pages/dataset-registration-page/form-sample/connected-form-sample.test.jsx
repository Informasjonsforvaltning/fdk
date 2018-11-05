import React from 'react';
import { createMockStore } from 'redux-test-utils';
import shallowWithStore from '../../../../test/shallowWithStore';
import { ConnectedFormSample } from './connected-form-sample.component';
import dataset from '../../../../test/fixtures/datasets';
import openlicenses from '../../../../test/fixtures/openlicenses';

test('should render ConnectedFormSample correctly', () => {
  const testState = {};
  const store = createMockStore(testState);
  const datasetItem = dataset.datasetItems._embedded.datasets[0];
  const { openLicenseItems } = openlicenses;
  const wrapper = shallowWithStore(
    <ConnectedFormSample
      datasetItem={datasetItem}
      openLicenseItems={openLicenseItems}
    />,
    store
  );
  expect(wrapper).toHaveLength(1);
});

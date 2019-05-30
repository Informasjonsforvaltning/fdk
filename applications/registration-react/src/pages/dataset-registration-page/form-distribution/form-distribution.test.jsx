import React from 'react';
import { createMockStore } from 'redux-test-utils';
import shallowWithStore from '../../../../test/shallowWithStore';
import { FormDistribution } from './form-distribution';
import dataset from '../../../../test/fixtures/datasets';
import openlicenses from '../../../../test/fixtures/openlicenses';

test('should render FormDistribution correctly', () => {
  const testState = {};
  const store = createMockStore(testState);
  const datasetItem = dataset.datasetItems._embedded.datasets[0];
  const { openLicenseItems } = openlicenses;

  const wrapper = shallowWithStore(
    <FormDistribution
      datasetItem={datasetItem}
      openLicenseItems={openLicenseItems}
    />,
    store
  );
  expect(wrapper).toHaveLength(1);
});

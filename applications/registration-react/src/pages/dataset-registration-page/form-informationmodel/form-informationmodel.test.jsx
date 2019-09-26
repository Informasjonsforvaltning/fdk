import React from 'react';
import { createMockStore } from 'redux-test-utils';
import shallowWithStore from '../../../../test/shallowWithStore';
import { FormInformationModel } from './form-informationmodel.component';
import dataset from '../../../../test/fixtures/datasets';

let wrapper;

test('should render FormInformationModel correctly', () => {
  const testState = {};
  const store = createMockStore(testState);
  const datasetItem = dataset.datasetItems._embedded.datasets[0];
  wrapper = shallowWithStore(
    <FormInformationModel datasetItem={datasetItem} />,
    store
  );
  expect(wrapper).toHaveLength(1);
});

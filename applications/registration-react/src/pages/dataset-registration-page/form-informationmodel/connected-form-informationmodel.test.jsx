import React from 'react';
import { createMockStore } from 'redux-test-utils';
import shallowWithStore from '../../../../test/shallowWithStore';
import FormInformationModel from './connected-form-informationmodel.component';
import dataset from '../../../../test/fixtures/datasets';

let wrapper;

test('should render FormInformationModel correctly', () => {
  const testState = {
    dataset: {
      result: dataset.datasetItems._embedded.datasets[0]
    }
  };
  const store = createMockStore(testState);
  wrapper = shallowWithStore(<FormInformationModel />, store);
  expect(wrapper).toHaveLength(1);
});

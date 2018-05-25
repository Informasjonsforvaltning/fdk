import React from 'react';
import { createMockStore } from 'redux-test-utils';
import shallowWithStore from '../../shallowWithStore';
import FormInformationModel from '../../../src/components/reg-form-schema-informationmodel/index';
import dataset from '../../fixtures/datasets';

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

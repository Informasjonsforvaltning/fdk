import React from 'react';
import { createMockStore } from 'redux-test-utils';
import shallowWithStore from '../../../../test/shallowWithStore';
import FormAccessRightsSchema from './connected-form-accessRights.component';
import dataset from '../../../../test/fixtures/datasets';

let wrapper;

test('should render FormAccessRightsSchema correctly', () => {
  const testState = {
    dataset: {
      result: dataset.datasetItems._embedded.datasets[0]
    }
  };
  const store = createMockStore(testState);
  wrapper = shallowWithStore(<FormAccessRightsSchema />, store);
  expect(wrapper).toHaveLength(1);
});

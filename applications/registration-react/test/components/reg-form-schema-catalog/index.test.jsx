import React from 'react';
import { createMockStore } from 'redux-test-utils';
import shallowWithStore from '../../shallowWithStore';
import FormCatalog from '../../../src/components/reg-form-schema-catalog/index';
import catalogs from '../../fixtures/catalogs';

let wrapper;

test('should render FormCatalog correctly', () => {
  const testState = {
    catalog: {
      catalogItem: catalogs.catalogItems._embedded.catalogs[0]
    }
  };
  const store = createMockStore(testState);
  wrapper = shallowWithStore(<FormCatalog />, store);
  expect(wrapper).toHaveLength(1);
});

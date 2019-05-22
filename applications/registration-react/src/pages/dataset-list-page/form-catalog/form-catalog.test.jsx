import React from 'react';
import { createMockStore } from 'redux-test-utils';
import shallowWithStore from '../../../../test/shallowWithStore';
import { FormCatalog } from './form-catalog';
import catalogs from '../../../../test/fixtures/catalogs';

let wrapper;

test('should render FormCatalogPure correctly', () => {
  const testState = {
    catalog: {
      catalogItem: catalogs.catalogItems[0]
    }
  };
  const store = createMockStore(testState);
  wrapper = shallowWithStore(<FormCatalog />, store);
  expect(wrapper).toHaveLength(1);
});

import React from 'react';
import { createMockStore } from 'redux-test-utils';
import shallowWithStore from '../../../../test/shallowWithStore';
import { ConnectedFormApiServiceType } from './connected-form-api-service-type';

test('should render ConnectedFormApiServiceType correctly', () => {
  const testState = {};
  const store = createMockStore(testState);
  const wrapper = shallowWithStore(<ConnectedFormApiServiceType />, store);
  expect(wrapper).toHaveLength(1);
});

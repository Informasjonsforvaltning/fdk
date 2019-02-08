import React from 'react';
import { createMockStore } from 'redux-test-utils';
import shallowWithStore from '../../../../test/shallowWithStore';
import { ConnectedFormApiStatus } from './connected-form-apiStatus';

test('should render ConnectedFormApiStatus correctly', () => {
  const testState = {};
  const store = createMockStore(testState);
  const wrapper = shallowWithStore(<ConnectedFormApiStatus />, store);
  expect(wrapper).toHaveLength(1);
});

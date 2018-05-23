import React from "react";
import { shallow } from 'enzyme';
import { createMockStore } from 'redux-test-utils';
import shallowWithStore from '../../shallowWithStore';
import RegCatalogsComponent, { RegCatalogs } from '../../../src/containers/reg-catalogs';
import user from '../../fixtures/user';
import catalogs from '../../fixtures/catalogs';

let defaultProps, store, wrapper, dispatch;

beforeEach(() => {
  dispatch = jest.fn();
  defaultProps = {
    dispatch,
    userItem: user.userItem,
    isFetchingUser: false
  }
  wrapper = shallow(<RegCatalogs  {...defaultProps} />);
});

test('should render ProtectedRoute correctly', () => {
  expect(wrapper).toHaveLength(1);
});

test('should render FormAccessRightsSchema correctly', () => {
  const testState = {
    catalogs
  };
  const store = createMockStore(testState)
  wrapper = shallowWithStore(<RegCatalogsComponent />, store);
  expect(wrapper).toHaveLength(1);
});

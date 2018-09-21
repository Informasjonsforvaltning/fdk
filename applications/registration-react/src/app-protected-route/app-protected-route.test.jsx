import React from 'react';
import { shallow } from 'enzyme';
import { createMockStore } from 'redux-test-utils';
import shallowWithStore from '../../test/shallowWithStore';
import ProtectedRouteComponent, {
  ProtectedRoute
} from './app-protected-route.component';
import user from '../../test/fixtures/user';

let defaultProps;
let wrapper;
let dispatch;

beforeEach(() => {
  dispatch = jest.fn();
  defaultProps = {
    dispatch,
    userItem: user.userItem,
    isFetchingUser: false
  };
  wrapper = shallow(<ProtectedRoute {...defaultProps} />);
});

test('should render ProtectedRoute correctly', () => {
  expect(wrapper).toHaveLength(1);
});

test('should render FormAccessRightsSchema correctly', () => {
  const testState = {
    user
  };
  const store = createMockStore(testState);
  wrapper = shallowWithStore(<ProtectedRouteComponent />, store);
  expect(wrapper).toHaveLength(1);
});

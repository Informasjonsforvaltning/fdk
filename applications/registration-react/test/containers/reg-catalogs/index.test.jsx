import React from 'react';
import { shallow } from 'enzyme';
import { createMockStore } from 'redux-test-utils';
import shallowWithStore from '../../shallowWithStore';
import RegCatalogsComponent, {
  RegCatalogs
} from '../../../src/containers/reg-catalogs';
import catalogs from '../../fixtures/catalogs';

let defaultProps;
let wrapper;
let dispatch;

beforeEach(() => {
  dispatch = jest.fn();
  defaultProps = {
    dispatch,
    catalogItems: catalogs.catalogItems,
    isFetchingCatalogs: false
  };
  wrapper = shallow(<RegCatalogs {...defaultProps} />);
});

test('should render ProtectedRoute correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should render FormAccessRightsSchema correctly', () => {
  const testState = {
    catalogs
  };
  const store = createMockStore(testState);
  wrapper = shallowWithStore(<RegCatalogsComponent />, store);
  expect(wrapper).toMatchSnapshot();
});

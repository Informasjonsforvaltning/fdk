import React from 'react';
import { shallow } from 'enzyme';
import { createMockStore } from 'redux-test-utils';
import shallowWithStore from '../../../test/shallowWithStore';
import RegCatalogsComponent, { RegCatalogs } from './catalogs-page';
import catalogs from '../../../test/fixtures/catalogs';

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

test('should render RegCatalogsComponent correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should render RegCatalogsComponent correctly with catalogItems', () => {
  const testState = {
    catalogs
  };
  const store = createMockStore(testState);
  wrapper = shallowWithStore(<RegCatalogsComponent />, store);
  expect(wrapper).toMatchSnapshot();
});

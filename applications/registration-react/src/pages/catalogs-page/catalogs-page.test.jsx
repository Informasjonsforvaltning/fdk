import React from 'react';
import { shallow } from 'enzyme';
import { RegCatalogs } from './catalogs-page';
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

test('should render RegCatalogs correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
